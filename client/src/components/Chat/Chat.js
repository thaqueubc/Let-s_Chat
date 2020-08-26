import React, {useEffect, useState} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import './Input.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

let socket;

const Chat = ({location}) =>{

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    // this useEffect will handle connect & disconnect event
    useEffect(() =>{
        const {name, room} = queryString.parse(location.search);
        
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join',{name, room}, (error) =>{
            if(error){
                alert(error);
            }
        });

        // this will happen when the component will be unmounted
        return () =>{
            socket.emit('disconnect');
            // turn off this socket instance(disconnect this user from chat)
            socket.off();
        }
    }, [ENDPOINT, location.search]);

    // this useEffect will handle message event
    useEffect(() =>{
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });
    }, []);

    const sendMessage = (event) =>{
       
        event.preventDefault();
        // send the message to backend and the clear the message using the callback method () => setMessage('')
        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    const setUserMessage = (message) =>{
        setMessage(message);
    }
    console.log("message", message);
    console.log("all messages", messages);
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <form className="form">
                    <input 
                    className="input"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                    />
                    <button className="sendButton" onClick={event => sendMessage(event)}>Send</button>
                </form>
               
                {/* <Input message={messages} setUserMessage={setUserMessage} sendMessage = {sendMessage} /> */}
            </div>
        </div>
    );
}

export default Chat;