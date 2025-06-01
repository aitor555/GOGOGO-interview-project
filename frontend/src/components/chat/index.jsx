import { useState, useEffect, useRef } from 'react'
import Button from './../button';
import Cookies from 'js-cookie';
import Tag from './../tag';
function Chat({ messages, sendMessage, roomFull }) {
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const [cantSend, setCantSend] = useState(false);
  const messagesEndRef = useRef(null);

  //temporary chat for testing
  const chat = [{ "username": "StoneSamurai", "color": "Black", "icon": "🖤", "message": "alright, I opened at 4-4. aggressive today 😤" }, { "username": "KoalatyMoves", "color": "White", "icon": "🤍", "message": "I see you. high and mighty. star-point samurai. classic." }, { "username": "StoneSamurai", "color": "Black", "icon": "🖤", "message": "your move’s looking a little... cautious. scared of a little shoulder hit?" }, { "username": "KoalatyMoves", "color": "White", "icon": "🤍", "message": "pfft. that shoulder hit is just going to give me thickness. thanks in advance." }, { "username": "StoneSamurai", "color": "Black", "icon": "🖤", "message": "🤨 did you just try a net? in my lower right corner? BOLD." }, { "username": "KoalatyMoves", "color": "White", "icon": "🤍", "message": "it’s not bold, it’s calculated chaos 😎" }, { "username": "StoneSamurai", "color": "Black", "icon": "🖤", "message": "I’m about to hane so hard you’ll feel it irl" }, { "username": "KoalatyMoves", "color": "White", "icon": "🤍", "message": "hane all you want, I’m already eyeing that weak group on the left" }, { "username": "StoneSamurai", "color": "Black", "icon": "🖤", "message": "IT’S NOT WEAK, IT’S FLEXIBLE" }, { "username": "KoalatyMoves", "color": "White", "icon": "🤍", "message": "it’s surrounded 😏" }]


  // Helps control the input and makes sure you can send message if there is content in the field
  function handleInput(data) {
    setMessage(data);
    setCantSend(false);
  }

  function handleSubmit(e) {
    e.preventDefault(); //prevents page from reload
    const formData = new FormData(e.target); //creates new formdata object
    const formJson = Object.fromEntries(formData.entries()); //turns the formatted data to a json object

    //handles empty message by playing animation
    if (!formJson.message.trim().length) {
      setCantSend(true);
    }

    //handles message by sending it to the parent, and then emptying the chat input
    else {
      sendMessage(formJson.message);
      setMessage('');
    }
  }
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  useEffect(() => {
    setDisabled(roomFull);
  }, []);

  return (
    <div className="border-2 border-fg2 lg:w-100 flex flex-col row-span-2 col-start-3 row-start-1">
      <p className="text-text2 text-xl m-4">Player chat</p>
      <div className="h-full flex p-4 overflow-y-scroll">
        <ul className="gap-4 max-h-100 flex-col last:bg-blue">
        {messages.map((item, index) => (
          <li key={index} className="mb-6 last:pb-8 hover">
            <span className="block text-lg text-text1 mb-2">{item.nickname} <Tag color={item.color}/></span>{item.message}
          </li>
        ))}
        
        </ul>
        <div ref={messagesEndRef} />
      </div>
      <form method="post" onSubmit={handleSubmit} className={`flex ${disabled?'hidden':''}`}>
        <input placeholder="write a message..." className={` w-full h-12 pl-3 bg-fg1 ${cantSend?'border-2 focus:outline-red-700 border-red-700 animate-wiggle':''}`} disabled={disabled} name="message" onChange={e => handleInput(e.target.value)} value={message}></input>
        <button className="px-5 h-12 bg-fg1 text-text1 cursor-pointer hover:bg-fg3 hover:text-text2 text-text1 focus:bg-fg3 focus:text-text2 " disabled={disabled}>Send!</button>
        </form>
    </div>
  )
}

export default Chat