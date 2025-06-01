import { useEffect } from 'react'
import { socket, sendMessage } from '../../scripts/socket';

function GameTest() {

  useEffect(() => {
    const goban = new Goban({'size': 13, 'offset': 600});
  }, []);

  /*****************************************\
  =======================================
 
                 Gobang JS

                    by

             Code Monkey King

  =======================================
\*****************************************/




const Goban = function(params) {
  // CANVAS
  var canvas, ctx, cell;

  // DATA
  const EMPTY = 0
  const BLACK = 1
  const WHITE = 2
  const MARKER = 4
  const OFFBOARD = 7
  const LIBERTY = 8

  var board = [];
  var history = [];
  var komi = 6.5;
  var size;
  var side = BLACK;
  var liberties = [];
  var block = [];
  var ko = EMPTY;
  var bestMove = EMPTY;
  var userMove = 0;
  var moveCount = 0;

function handleSetStone(data, sq, bool) {
    socket.emit('move', (sq, side, bool), (response) => {
      console.log(response);
    });
}

  // PRIVATE METHODS
  function drawBoard() { /* Render board to screen */
    cell = canvas.width / size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 1; i < size-1; i++) {
      const x = i * cell + cell / 2;
      const y = i * cell + cell / 2;
      let offset = cell * 2 - cell / 2;
      ctx.moveTo(offset, y);
      ctx.lineTo(canvas.width - offset, y);
      ctx.moveTo(x, offset);
      ctx.lineTo(x, canvas.height - offset);
      ctx.strokeStyle = "white";  
    };ctx.stroke();
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        let sq = row * size + col;
        let starPoints = {
           9: [36, 38, 40, 58, 60, 62, 80, 82, 84],
          13: [64, 67, 70, 109, 112, 115, 154, 157, 160],
          19: [88, 94, 100, 214, 220, 226, 340, 346, 352]
        }
        if ([9, 13, 19].includes(size-2) && starPoints[size-2].includes(sq)) {
          ctx.beginPath();
          ctx.arc(col * cell+(cell/4)*2, row * cell +(cell/4)*2, cell / 6 - 2, 0, 2 * Math.PI);
          ctx.fillStyle = '#121315';
          ctx.fill();
          ctx.stroke();
        }
        if (board[sq] == 7) continue;
        let color = board[sq] == 1 ? "black" : "white";
        if (board[sq]) {
          ctx.beginPath();
          ctx.arc(col * cell + cell / 2, row * cell + cell / 2, cell / 2 - 2, 0, 2 * Math.PI);
          ctx.fillStyle = color == "black" ? "#121315" : "#D9D9D9";
          ctx.fill();
          ctx.stroke();
        }
        if (sq == userMove) {
          let color = board[sq] == 1 ? "white" : "black";
          ctx.beginPath();
          //ctx.arc(col * cell+(cell/4)*2, row * cell +(cell/4)*2, cell / 5 - 2, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }

  function userInput(event) { /* Handle user input */
    if (params.sgf) return;
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    let col = Math.floor(mouseX / cell);
    let row = Math.floor(mouseY / cell);
    let sq = row * size + col;
    if (board[sq]) return;
    if (!handleSetStone(sq, side, true)) return;

    drawBoard();
    setTimeout(function() { try { params.response(); } catch (e) { /* Specify custom response function */ } }, 100)
  }

  function clearBoard() { /* Empty board, set offboard squares */
    for (let sq = 0; sq < size ** 2; sq++) {
      switch (true) {
        case (sq < size):
        case (sq >= (size ** 2 - size)):
        case (!(sq % size)):
          board[sq] = OFFBOARD;
          board[sq-1] = OFFBOARD;
          break;
        default: board[sq] = 0;
      }
    }
  }


function resizeCanvas() {
  let offset = params.offset === undefined ? 0 : params.offset;

  let baseSize = Math.min(window.innerWidth, window.innerHeight) - offset;
  if (baseSize < 50) baseSize = 50;

  const maxSize = 800;
  const minSize = 150;
  const maxViewport = 1200;

  let normalized = Math.min(baseSize, maxViewport) / maxViewport;
  let scale = Math.cbrt(normalized);

  let canvasSize = minSize + (maxSize - minSize) * scale;
  canvasSize = Math.max(canvasSize, 50);

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  drawBoard();
}


  function init() { /* Init goban module */
    let container = document.getElementById('goban');
    canvas = document.createElement('canvas');
    canvas.style="margin-bottom: -3%;";
    container.appendChild(canvas);
    size = params.size+2;
    canvas.addEventListener('click', userInput);
    ctx = canvas.getContext('2d');
    clearBoard();
    history.push({
      'ply': 0,
      'side': BLACK,
      'move': EMPTY,
      'board': JSON.stringify(board),
      'ko': ko
    });
    moveCount = history.length-1;
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }
  
  // PUBLIC API
  return {
    init: init(),
    BLACK: BLACK,
    WHITE: WHITE,
    position: function() { return board; },
    setKomi: function(komiVal) { komi = komiVal; },
    komi: function() { return komi; },
    history: function() { return history; },
    side: function() { return side; },
    ko: function() { return ko; },
    count: function(sq, color) { return count(sq, color); },
    liberties: function() { return liberties; },
    restore: function() { return restoreBoard(); },
    play: function(sq, color, user) { return setStone(sq, color, user); },
    pass: function() { return pass(); },
    refresh: function() { return drawBoard(); }
  }
}
  return <div id="goban"></div>;
}

export default GameTest
