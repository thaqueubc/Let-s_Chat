// import modules
const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// Declare the port number. By default, it will use port 5000
// In production, it will take the port number from environment settings
const PORT = process.env.PORT || 5000;

// import the router
const router = require('./router');

// import users helper methods
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

// Create a new server with express
const app = express();
const server = http.createServer(app);

// initialize the instance of socket.io with server
const io = socketio(server);

//Connect & disconnect user using socket.io
io.on('connection',(socket) =>{
    console.log("We have a connection !!!!");

    socket.on('join', ({name, room}, callback) => {
        const {error, name} = addUser({id:socket.id, name, room});

        // if any error is found then return
        if(error) return callback(error);

        // if not found then use another method called 'join' from socket
        // to join the user with a room
        
        socket.join(user.room);
    })
    
    socket.on('disconnect', () =>{
        console.log("User had left");
    })
});

// use the router as a middleware 
app.use(router);

server.listen(PORT, () => {console.log(`Server has started on ${PORT}`)});


