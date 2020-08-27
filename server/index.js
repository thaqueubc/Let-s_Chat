// import modules
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const mongo = require('mongodb').MongoClient;

// Declare the port number. By default, it will use port 5000
// In production, it will take the port number from environment settings
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const url = 'mongodb://127.0.0.1:27017/letsChatDb';

// import the router
const router = require('./router');

// import users helper methods
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

// Create a new server with express
const app = express();
const server = http.createServer(app);

// initialize the instance of socket.io with server
const io = socketio(server);


mongo.connect(
    url,
     { useNewUrlParser: true, useUnifiedTopology: true },
     //callback function
     // need to pass 'client' instead of 'db' for mongodb version>=3.0.0
      (err, client) => { 
        if (err) {throw err;}
    
        console.log('MongoDB is connected...');
        
        //Connect & disconnect user using socket.io
        io.on('connect',(socket) =>{
            
            //Create a collection to store chats
            let database = client.db('letsChatDb');
            let chat = database.collection('chats');

            socket.on('join', ({name, room}, callback) => {
                const {error, user} = addUser({id:socket.id, name, room});

                // if any error is found then return
                if(error) return callback(error);

                // if error not found then use another method called 'join' from  the socket.io
                // to join the user with a room
                socket.join(user.room);

                // admin generated Messages
                // Emit an event to welcome the individula user to the chat room
                socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
                // Emit an event to let all other users know that a new user has joined
                socket.broadcast.to(user.room).emit('message',  { user: 'admin', text: `${user.name}, has joined`});

                io.to(user.room).emit('roomData', { room:user.room, users: getUsersInRoom(user.room) });

                callback();
                
            });

            // handle the messages coming from the frontend from users
            // this part is a response of the message event, emited from the frontend
            socket.on('sendMessage', (message, callback) =>{
                const user = getUser(socket.id);

                let name = user.name;
                let msg = message;

                chat.insert({
                    name: name,
                    msg: msg
                }, () => {
                    io.to(user.room).emit('message', {user: user.name, text:message});

                })
               
                callback();
            });
            
            socket.on('disconnect', () =>{
            const user = removeUser(socket.id);

            if(user){
                io.to(user.room).emit('message', {user: 'admin', text:`${user.name} has left.`});
                io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
            }
            })
        });
                
})//Mongo db Connection is closed 


// use the router as a middleware 
app.use(router);

server.listen(PORT, () => {console.log(`Server has started on ${PORT}`)});


