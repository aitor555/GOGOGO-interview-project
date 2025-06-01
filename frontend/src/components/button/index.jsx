import { useState } from 'react'
function Button({ text, type, onClick }) {
  const variants = {
    action: "px-4 py-1 bg-warning1 cursor-pointer hover:bg-warning2 min-w-18 active:bg-warning2 box-border h-12",
    secondary: "px-4 py-1 cursor-pointer hover:underline min-w-18 active:bg-red-600 box-border h-12",
    default: "px-4 py-1 bg-fg2 cursor-pointer hover:bg-fg3 hover:text-text2 min-w-18 text-text1 h-12 focus:bg-fg3 focus:text-text2"
  }

  return <button className={`${variants[type ? type : "default"]} capitalize`} onClick={onClick}>{text}</button>;
}

export default Button
