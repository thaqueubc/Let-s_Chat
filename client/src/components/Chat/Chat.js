import React, {useEffect, useState} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

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
        socket.on('message', (message) =>{
            setMessages(messages => [...messages, message]);
        });
    }, [messages]);

    const sendMessage = (event) =>{
       
        event.preventDefault();
        // send the message to backend and the clear the message using the callback method () => setMessage('')
        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(messages, message);
    return (
        <div className="outerContainer">
            <div className="container">
                <input value={message} 
                onChange={ (event) => setMessage(event.target.value)}
                onKeyPress = { (event) => event.key === 'Enter' ? sendMessage(event) : null }
                />
            </div>
        </div>
    );
}

export default Chat;