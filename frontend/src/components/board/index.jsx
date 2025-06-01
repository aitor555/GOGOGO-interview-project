import { useState } from 'react'
import TempGame from './../tempGame';
import GameTest from './../gameTest';

function Board({roomCode, score}) {
  const [board, setBoard] = useState([]);
  const [captures, setCaptures] = useState([]);
  const [ko, setKo] = useState([]);
  const [moves, setMoves] = useState(0);

  //komi is locked at 7.5 for now, could be changed in the future
  const komi = 7.5;

  function handleGameState(newValue) {
    const { board, captures, ko, moves } = newValue;
    setBoard(board);
    setCaptures(captures);
    setKo(ko);
    setMoves(moves);

    //janky solution to unflip scores flipping in game
    let fixedCaptures = moves % 2 === 0 ? captures : [captures[1], captures[0]];
    score(fixedCaptures);
  }

  return (
    <div className="border-2 border-fg2 p-4 col-span-2 bg-bg2 max-h-220">
      <div className="flex justify-between"><span className="text-text2 text-2xl">GOGOGO</span> <span className="text-text2 text-2xl text-right ">Room: {roomCode}</span></div>
      <div className="min-h-100 place-items-center">
        <TempGame handleGame={handleGameState}/>
      </div>
    </div>
  )
}

export default Board
