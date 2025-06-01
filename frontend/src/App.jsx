import { useState, useEffect, useImperativeHandle } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './App.css'
import { socket, sendMessage } from './scripts/socket';
import Cookies from 'js-cookie';
import Board from './components/board';
import Chat from './components/chat';
import Controls from './components/controls';
import Modal from './components/modal';
import Splash from './components/splash';
import GameTest from './components/gameTest';


function App() {
  const [messages, setMessages] = useState([]);
  const [roomCode, setRoomCode] = useState(null);
  const [gameID, setGameID] = useState('');
  const [nickname, setNickname] = useState('');
  const [modal, setModal] = useState(false);
  const [userID, setUserID] = useState(() => {

    //checks for a userID in cookies, generates a new one if not available and saves it
    const IDfromCookie = Cookies.get('userId');
    console.log(IDfromCookie);
    if (IDfromCookie && IDfromCookie !== 'undefined') return IDfromCookie;
    const newId = uuidv4();
    Cookies.set('userId', newId);
    return newId;
  });
  const [captures, setCaptures] = useState([0,0]);
  const [roomFull, setRoomFull] = useState('');


  //function to create a new game via classic REST API
  async function createGame(data) {
    try {
      
      //tries to create game
      const res = await fetch('http://localhost:5001/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: userID,
          nickname: data.nickname,
        }),
      });
      const dataDone = await res.json();
      console.log(dataDone);
      //if succesfull it joins the game (or techincally it joins the socket room) and sets the roomcode so others can join
      joinGame(dataDone.data);
      setRoomCode(dataDone.data.room_code);
    } catch (err) {
      console.error('Failed to create game', err);
    }
  }

  //joins game, this function is called in both create and just a regular join
  function joinGame(data) {

    socket.emit('join_game', ({...data, userID}), (response) => {
      Cookies.set('GameSession', JSON.stringify(response));
      if(data.userID){Cookies.set('userId', data.userID);}
      setUserData(response);
    });
  }

  //updates the list of messages
  function addMessage(newValue) {
    setMessages(prevItems => [...prevItems, newValue]);
  }

  //simply sets user data recieved from backend when updated
  function setUserData(data){
    setRoomCode(data.roomCode);
    setNickname(data.nickname);
    setRoomFull(data.roomFull);
  }

  function toggleModal(){
    setModal(!modal);
  }

  //updates the player score on the bottom
  function setScore(data) {
    setCaptures(data);
  }

  useEffect(() => {
    //update on new messages
    socket.on('message', (data) => {
      addMessage(data);
    });

  }, []);


  return ( 
    <>
    <div className="flex flex-col lg:grid gap-3 grid-cols-3 grid-rows-[1fr_auto] auto-rows-min font-plex">
          {!roomCode ? (
          <Splash createGame={createGame} joinGame={joinGame}/>
          ) : (<>
          <Board roomCode={roomCode} score={setScore}/>
          <Controls score={captures} handleForfeit={toggleModal}/>
          <Chat messages={messages} sendMessage={sendMessage} roomFull={roomFull}/>
          </>)}
      </div> 
      {modal ? <Modal handleForfeit={toggleModal}/> : <></>}
    </>
  )
}

export default App