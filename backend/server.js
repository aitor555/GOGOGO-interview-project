import express from 'express';
import cors from 'cors';
import { Server } from "socket.io";
const app = express();
const port = process.env.PORT || 5000;
import pool from './config/db.js';

// Middlewares
app.use(cors());
app.use(express.json());


//import { setStone } from './controllers/GameController.js';
import gameRoutes from './routes/Games.js';
import errorHandling from './middlewares/errorhandling.js';


app.use('/api', gameRoutes);

app.use(errorHandling);

const expressServer = app.listen(port, () => console.log(`Express server listening on port ${port}...`));
const io = new Server(expressServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

app.get('/', async (req, res) => {
	const result = await pool.query('SELECT current_database()');
	res.send(`the db name is: ${result.rows[0].current_database}`)
})

io.on('connection', (socket) => {


	// listening for a join_game event
	socket.on('join_game', async (data, callback) => {
		//checks if room exists
		const gameExists = await pool.query(`SELECT * FROM games WHERE room_code = $1`, [data.roomCode]);
		const gameData = gameExists.rows[0];
		if (gameExists.rows.length === 0) {
			console.log("join failed");
			return socket.emit("error", `Room ${data.roomCode} does not exist`);
		}

		if (gameData.player_white == null && data.userID !== gameData.player_black) {

			await pool.query('BEGIN');

			await pool.query(
				'INSERT INTO users (id, username) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET username = $2',
				[data.userID, data.nickname]
			);

			await pool.query(
				'UPDATE games SET player_white = $1, status = $3 WHERE id = $2',
				[data.userID, gameData.id, 'active']
			);

			await pool.query('COMMIT');
		}


		if(gameData.player_white !== null && gameData.player_black !== null){
			
			callback({
			roomCode: data.roomCode,
			UserID: data.userID,
			nickname: data.nickname,
			roomFull: true
		});
		}

		socket.emit("joined", `Joined room: ${data.roomCode}`);
		// if worked returns a callback response to the frontend
		callback({
			roomCode: data.roomCode,
			UserID: data.userID,
			nickname: data.nickname,
			roomFull: false,
			... gameData
		});
		socket.join(data.roomCode);
	})

	socket.on('move', async data => {
		const {position, moveToSquare} = data;
		    function isEyeish(board, square) {
      let eyecolor = null;
      let othercolor;
      const neighbors = getNeighbors(square);
      for (let neighbor of neighbors) {
        if (board[neighbor].trim() === "") continue;
        if (board[neighbor] === '.') return null;
        if (eyecolor === null) {
          eyecolor = board[neighbor];
          othercolor = eyecolor === eyecolor.toUpperCase() ? eyecolor.toLowerCase() : eyecolor.toUpperCase();
        } else if (board[neighbor] === othercolor) return null;
      };return eyecolor;
    }

    function getNeighbors(square) { return [square-1, square+1, square-(15), square+(15)]; }
    function setStone(board, square, stone) { return board.slice(0, square) + stone + board.slice(square + 1); }

    function floodfill(board, square) {
      let byteboard = new Uint8Array(board.split('').map(char => char.charCodeAt(0)));
      let color = byteboard[square];
      byteboard[square] = '#'.charCodeAt(0);
      let fringe = [square];
      while (fringe.length > 0) {
        square = fringe.pop();
        for (let neighbor of getNeighbors(square)) {
          if (byteboard[neighbor] == color) {
            byteboard[neighbor] = '#'.charCodeAt(0);
            fringe.push(neighbor);
          }
        }
      };return String.fromCharCode.apply(null, byteboard);
    }

    function contact(board, color) {
      const match = board.match(contactRegexes[color]);
      if (!match) return null;
      return match.index;
    }

    // Go rules
    const contactRegexes = {};
    const regexSources = {
      '.': '\\.',
      'x': 'x',
      'X': 'X'
    };
    
    for (let color in regexSources) {
      const regexPattern = regexSources[color];
      const contactRegexSources = [
        `#${regexPattern}`,                             // color at right
        `${regexPattern}#`,                             // color at left
        `#${'.'.repeat((15) - 1)}${regexPattern}`,  // color below
        `${regexPattern}${'.'.repeat((15) - 1)}#`   // color above
      ]; contactRegexes[color] = new RegExp(contactRegexSources.join('|'), 's');
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

    const makeMove = (position, square) => {
      if (position.board[square] != ".") return null;
      if (square == position.ko) return null;
      let inEnemyEye = (isEyeish(position.board, square) == 'x');
      let board = setStone(position.board, square, 'X');
      let captureX = position.captures[0];
      let singleCaptures = [];
      for (let neighbor of getNeighbors(square)) {
        if (board[neighbor] != "x") continue;
        let floodfillBoard = floodfill(board, neighbor);
        if (contact(floodfillBoard, '.') != null) continue;
        let capture_count = floodfillBoard.split('#').length - 1;
        if (capture_count == 1) singleCaptures.push(neighbor);
        captureX += capture_count;
        board = floodfillBoard.split("#").join(".");
      }
      let ko = (inEnemyEye && singleCaptures.length) ? singleCaptures[0] : null; 
      if (contact(floodfill(board, square), ".") == null) return null;
      board = board.split('').map(c => c == c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
      return Position(board, [position.captures[1], captureX], position.moves+1, ko, 7.5);
    }
			await pool.query('BEGIN');
			await pool.query(`
			INSERT INTO moves (game_id, player_id)
			VALUES ($1, $2)
			`, [data.gamesession.id, data.gamesession.UserID]
			);
			await pool.query('COMMIT');


			io.to(data.roomCode).emit('moveResult', makeMove(position, moveToSquare));
	});



	// listening for a message event
	socket.on('message', async data => {
		const gameExists = await pool.query(`SELECT * FROM games WHERE room_code = $1`, [data.roomCode]);
		const gameData = gameExists.rows[0];
		if(data.UserID === gameData.player_black || data.UserID === gameData.player_white){
			io.to(data.roomCode).emit('message', { 'UserID': `${data.userID}`, 'message': `${data.message}`, 'nickname': `${data.nickname}` })
		}
	});


	// listening for a discconect event
	socket.on('disconnect', () => {
		console.log(`${socket.id} disconnected`);
	})
});