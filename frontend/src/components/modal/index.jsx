import { useState } from 'react'
import Button from './../button';

function Modal({handleForfeit}) {

  return (
    <div className="top-0 left-0 fixed w-screen h-screen backdrop-blur-xs bg-bg/10 flex">

      <div className="m-auto border-2 border-fg2 p-12 bg-bg flex-col flex items-center">
          <h1 className="mb-10 text-2xl">Are you sure you want to Forfeit?</h1>
          <div className="flex gap-4">
            <Button text="Cancel" onClick={handleForfeit}/>
            <Button text="I'm sure" type="action" onClick={handleForfeit}/>
          </div>
      </div>
    </div>
  )
}

export default Modal
