import pool from '../config/db.js';

//standardized response function
const handleResponse = (res, status, message, data = null) => {
	res.status(status).json({
		status,
		message,
		data,

	})
}

import bannedWords from '../utils/bannedWords.js';

//function to generate a random 4 digit alphanumeric code for rooms
const generateRoomID = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  let isClean = false;

  while (!isClean) {
    result = '';
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const lowerResult = result.toLowerCase();
    isClean = true;

    for (const word of bannedWords) {
      if (lowerResult.includes(word)) {
        isClean = false;
        break;
      }
    }
  }

  return result;
};

export const createGame = async (req, res, next) => {
	const roomID = generateRoomID();
	const userID = req.body.userID;
	const nickname = req.body.nickname;

	console.log(req.body.userID);
	try {
		await pool.query('BEGIN');

		await pool.query(
			'INSERT INTO users (id, username) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
			[userID, nickname]
		);
		const result = await pool.query(`
			INSERT INTO games (room_code, player_black, status)
			VALUES ($1, $2, 'waiting')
			RETURNING id, room_code, player_black
			`, [roomID, userID]);
		const reply = {
			roomID: result.rows[0].id,
			userID: result.rows[0].player_black,
			roomCode: result.rows[0].room_code,
			nickname: nickname
		}
		await pool.query('COMMIT');

		handleResponse(res, 201, "game created successfully", reply)
	} catch (err) {
		next(err)
	}
}


