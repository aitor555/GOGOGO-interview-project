import { io } from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5001';

const socket = io(URL);

socket.on("connect", () => {
  console.log("Connected with ID:", socket.id);
});

function getSocketId() {
  return socket.id;
}

const sendMessage = (message) => { 
	let cookie = JSON.parse(Cookies.get('GameSession'));
	let outbound = {...cookie, message}
	socket.emit('message', outbound);	
};

export {
	socket,
	sendMessage,
	getSocketId
};