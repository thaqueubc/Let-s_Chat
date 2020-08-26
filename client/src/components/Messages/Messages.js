import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

import './Messages.css';
import Message from './Message/Message';

const  Messages= ({messages, name}) =>{ 
   console.log("Name" , name);
   console.log("Message", messages);
   return (
     // <h1>Error</h1>
      <ScrollToBottom className="messages">
         {messages.map((message, index) => <div key={index}><Message message={message} name={name}/></div>)}
      </ScrollToBottom>
  )
}
  
  export default Messages;