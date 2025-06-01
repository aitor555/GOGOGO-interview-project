import { useState } from 'react'

function Splash({ createGame, joinGame }) {
const [nickname, setNickname] = useState('');
const [roomID, setRoomID] = useState('');
const [error, setError] = useState(false);


  function handleSubmit(e) {
    e.preventDefault(); //prevents page from reload
    const formData = new FormData(e.target); //creates new formdata object
    const formJson = Object.fromEntries(formData.entries());
    const submitter = event.submitter.name;


    const { nickname, roomCode } = formJson;

    if (submitter == "newBtn" && nickname) {
      const response = createGame(formJson);
    }

    else if (submitter == "joinBtn" && nickname && roomCode) {
      const response = joinGame(formJson);

      //if the response returns undefined (which it does if no room exists), sets error
      if(!response){
        setError(true);
      }
    }

    //handleStart(formJson, submitter);
  }

  function handleKeyDown(e) {
        if (event.keyCode === 13 ) {
        event.preventDefault();
    }
  }

  return (
    <div className="top-0 left-0 fixed w-screen h-screen bg-bg flex z-10">

      <div className="m-auto min-w-120 border-2 border-fg2 p-12 bg-bg flex-col flex items-center">
          <h1 className="mb-10 text-xl text-center">welcome to <span className="block text-5xl mt-2">GOGOGO</span></h1>
          <form className="flex gap-4 flex-col w-full" method="post" onSubmit={handleSubmit}>
          <input placeholder="Your nickname" className="w-full h-12 pl-3 bg-fg1" name="nickname" onKeyDown={handleKeyDown}></input>
          <input placeholder="Enter room code" className="w-full h-12 pl-3 bg-fg1" name="roomCode" onKeyDown={handleKeyDown}></input>
          <div className="grid grid-cols-2 gap-4 w-full">
            <button type="action" name="joinBtn" className="px-4 py-1 bg-warning1 cursor-pointer hover:bg-warning2 min-w-20 active:bg-warning2 box-border h-12 w-50%">Join existing game</button>
            <button type="action" name="newBtn" className="px-4 py-1 bg-warning1 cursor-pointer hover:bg-warning2 min-w-20 active:bg-warning2 box-border h-12">Create new game</button>
            </div>
          </form>
          <span className={`text-sm text-red-400 mt-6 break-words max-w-100 break-words ${error == true ?'':'hidden'}`}>Couldn't find room. Check if spelling is correct and if the game is still active.</span>
      </div> 
      </div>
  )
}

export default Splash