const server = require('http').createServer()
const io = require('socket.io')(server)
var messages = [];

io.on("connection", (socket) => {
    socket.emit('messages_list', messages);

    socket.on('message', function name(data) {
        messages.push(data);
        console.log(messages);
    })
});



var server_port = process.env.PORT || 3000;
server.listen(server_port, function (err) {
    if (err) throw err
    console.log('Listening on port %d', server_port);
});