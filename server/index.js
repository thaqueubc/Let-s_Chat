const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// Declare the port number. By default, it will use port 5000
// In production, it will take the port number from environment settings
const PORT = process.env.PORT || 5000;

// import the router
const router = require('./router');

// Create a new server with express
const app = new express();
const server = http.createServer(app);

// initialize the instance of socket.io with server
const io = socketio(server);

// use the router as a middleware 
app.use(router);

server.listen(PORT, () => {console.log(`Server has started on ${PORT}`)});


