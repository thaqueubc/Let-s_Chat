const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to Mongo
const url = 'mongodb://127.0.0.1/letsChat';

mongo.connect(
    url,
     { useNewUrlParser: true, useUnifiedTopology: true },
     //callback function
      (err, db) => { 
        if (err) {throw err;}
    
        console.log('MongoDB is connected...');

        // Connect to socket.io
        client.on('connection', function(){
            //Create a collection to store chats
            let chat = db.collection('chats');

            // Create function to send status
            sendStatus = function(s){
                socket.emit('status',s);
            }

            //Get Chats from mongo Collection
            chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
                if (err) {throw err;}

                //Emit the ,emit the messages
                socket.emit('output', res);
            });

            
        })

      }
    );