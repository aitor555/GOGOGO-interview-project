import { useState } from 'react'
import Button from './../button';

function Controls({score, handleForfeit}) {
const [disabled, setDisabled] = useState(false);

  return (
    <div className=" h-13 col-span-2 flex border-2 border-fg2 bg-bg2">
    <span className="text-text2 text-xl align-self-start content-center ml-4 flex items-center">score: </span>
    <span className="text-text2 text-xl align-self-start content-center mx-4 flex items-center">
      <div className="rounded-full h-6 w-6 bg-black inline-block flex items-center mr-3 border-white/40 border-1"></div> {score[0]}
    </span>

    <span className="text-text2 text-xl align-self-start mr-auto content-center flex items-center">
      <div className="rounded-full h-6 w-6 bg-white inline-block flex items-center mr-3"></div> {score[1]} 
    </span>
      <div className={`flex ${disabled?'hidden':''}`}>
      <Button text="pass"/>
      <Button text="forfeit" type="action" onClick={handleForfeit}/></div>
    </div>
  )
}

export default Controls
