socket = require('socket.io')



module.exports = (server) => {
var io = socket(server);

io.on('connection', (socket) => {
    console.log('a user connected to the socket', socket.id);
    socket.on('chat message', function(msg){
        io.emit('chat message', socket.id + ":  " + msg);
    });
    socket.on('disconnect', () => console.log('a user left us'));
});

}

