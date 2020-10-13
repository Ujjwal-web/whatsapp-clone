import React, {useEffect,useState} from "react";
import Sidebar from "./Sidebar.js";
import Chat from "./Chat.js";
import "./App.css";
import Pusher from "pusher-js"
import axios from "axios"

function App() {
const [messages,setMessages]  = useState([]);

  useEffect(() => {
    axios.get('messages/sync')
    .then(response => {
      setMessages(response.data);
    })
  },[]);

   useEffect(() => {
    const pusher = new Pusher('964745683bd9b9136771', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessages) => {
      // alert(JSON.stringify(newMessages));
      setMessages([...messages,newMessages])
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
   } ,[messages])

   console.log(messages);
  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat
         messages={messages}/>
      </div>
    </div>
  );
}

export default App;
