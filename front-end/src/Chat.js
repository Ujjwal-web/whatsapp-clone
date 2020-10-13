import React, { useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { SearchOutlined } from "@material-ui/icons";
import MicIcon from "@material-ui/icons/Mic";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import axios from "axios";

function Chat({messages}) {
  const [input,setInput] = useState("");

   const sendMessage = (e) => {
     e.preventDefault();
      
     axios.post('/messages/new', {
       message : input,
       name: "ME",
       timeStamp: "Justnow!",
       received : true,
     });
   }
 

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>Room Name</h3>
          <p>Last seen Avatar</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
      {messages.map((message) => (
        <div className={`chat_message ${message.received && "chat_message_receive"}`}>
          <p>
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_time">{new Date().toUTCString()}</span>
          </p>
        </div>
      ))}
        
      </div>
      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form >
          <input value={input} onChange={(e) => setInput(e.target.value) } placeholder="Type a message" type="text"></input>
          <button onClick={sendMessage} type="submit">Send a message</button>
        </form>
        <MicIcon></MicIcon>
      </div>
    </div>
  );
}

export default Chat;
