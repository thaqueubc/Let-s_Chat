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

            // Handle input events. data is the messeage send by someone else
            // we need to read 'data' and retrieve the name of the sender and the message
            socket.on('input', function(data){
                let name = data.name;
                let message = data.message;

                //Check for name and message
                if(name == '' || message == ''){
                    //send error status
                    sendStatus('Please send a name and message');
                }else{
                    // insert message
                    chat.insert({
                        name: name,
                        message:message
                    }, function(){
                        client.emit('output', [data]);

                        // send status object
                        sendStatus({
                            message: 'Message sent',
                            clear: true
                        });
                    });
                }
            });

            //Handle clear
            socket.on('clear', function(data){
                //Remove all chats from the collection
                chat.remove({}, function(){
                    socket.emit('cleared');
                })
            })

        });

      }
    );