const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000);

// Connect to Mongo
mongo.connect('mongodb://127.0.0.1/letsChat', function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB is connected...');
})