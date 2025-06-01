import { useState } from 'react'
function Tag({color }) {
  const variants = {
    White: "bg-black text-white",
    Black: "bg-white text-black",
    default: "bg-gray-800 text-white"
  }

  return <span className={`${variants[color ? color : "default"]} text-[10px] -translate-y-[3px] mr-1 rounded-full px-2 py-1`}>{color ? color : "N/A"}</span>;
}

export default Tag
