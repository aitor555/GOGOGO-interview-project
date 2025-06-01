import { useState, useEffect } from 'react';
import { socket, sendMessage } from '../../scripts/socket';
import Cookies from 'js-cookie';

function TempGame({handleGame}) {
const [board, setBoard] = useState([]);
const [captures, setCaptures] = useState([]);
const [ko, setKo] = useState([]);
const [position, setPosition] = useState(initBoard());
const komi = 7.5;
const [moves, setMoves] = useState(0);


useEffect(() => {
const canvas = document.getElementById('gobang');
    const ctx = canvas.getContext('2d');
    const cell = canvas.width / (15);
    ctx.imageSmoothingEnabled = true;

    function moveToSquare(x, y) { return y*(15)+ x; }

    socket.on('moveResult', (data) => {
      if (data != null) {
        setPosition(data);
        drawBoard(data);
        handleGame(data);
      }
      
    });

    function drawBoard(position) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      for (let i = 1; i < (15)-1; i++) {
        let x = i * cell + cell / 2;
        let y = i * cell + cell / 2;
        let offset = cell * 2 - cell / 2;
        ctx.moveTo(offset, y);
        ctx.lineTo(canvas.width - offset, y);
        ctx.moveTo(x, offset);
        ctx.lineTo(x, canvas.height - offset);
        ctx.strokeStyle = "#D9D9D9";
      };ctx.stroke();
      for (let row = 0; row < (15); row++) {
        for (let col = 0; col < (15); col++) {
          let square = moveToSquare(col, row);
          let board = "";
          if (position.moves % 2 == 0) board = position.board.split('x').join('O');
          else board = position.board.split('X').join('O').split('x').join('X');
          if (position.board[square] == " " || position.board[square] == "\n") continue;
          let color = board[square] == "X" ? "#121315" : "#D9D9D9";
          if (position.board[square] != ".") {
            ctx.beginPath();
            ctx.arc(col * cell + cell / 2, row * cell + cell / 2, cell / 2 - 2, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.stroke();
          }
        }
      }
    }
    
    
    // MAIN
    function userInput(event) {
      const gamesession = Cookies.get('GameSession');
      const roomcode = JSON.parse(gamesession);
      let rect = canvas.getBoundingClientRect();
      let mouseX = event.clientX - rect.left;
      let mouseY = event.clientY - rect.top;
      let col = Math.floor(mouseX / cell);
      let row = Math.floor(mouseY / cell);
      socket.emit('move', ({gamesession: roomcode, roomCode: roomcode.roomCode, position: position,  moveToSquare: moveToSquare(col, row)}));
    }
    
    canvas.addEventListener('click', userInput);
    drawBoard(position);

  return () => {
    canvas.removeEventListener('click', userInput);
    socket.off('moveResult');
  };

  }, [position]);

    function initBoard() {
      let empty = [...Array(15)].map((_, i) => i === 0 ?
        ' '.repeat(14) : i === 13 + 1 ?
          ' '.repeat(15) : ' ' +
          '.'.repeat(13)).join('\n');
      return Position(empty, [0, 0], 0, null, 7.5);
    }

    
    function Position(board, captures, moves, ko, komi) {
      return {
      "board": board,
      "captures": captures,
      "moves": moves,
      "ko": ko,
      "komi": komi
      }
    }

  return (
    <canvas
    id="gobang"
    width="700"
    height="700"
    style={{padding: 0, margin: 'auto', display: 'block'}}>
  </canvas>
  )
}

export default TempGame