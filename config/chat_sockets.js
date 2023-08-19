module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        transports: ['websockets']
    });

    console.log('Entered the server side file: chat_sockets!');

    io.sockets.on('connection', function(socket){
        console.log('New connection recieved: ', socket.id);

        socket.on('disconnect', function(){
            console.log('Socket Disconnected!!');
        });

        socket.on('join_room', function(data){
            console.log('Joining request recieved: ', data);

            // data emitted on the client side to join the chat room D-Tox is recieved on the server side here
            socket.join(data.chatroom);

            // Once the user has joined the chatroom D-Tox, the below call sends the notification to all the users
            // inside the chatroom that this particular user has joined the chatroom
            io.in(data.chatroom).emit('user_joined: ', data);
        })
    });
}