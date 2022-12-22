const server = require('http').createServer()
const io = require('socket.io')(server, {
    allowEIO3: true
  })
var users = [];

function removeUser(id) {
    var index = users.findIndex(x => x.id === id);
    if (index !== -1) {
        users.splice(index, 1);
    }
}

io.on("connection", (socket) => {
    console.log(`${socket.id} trying to connect`);

    if (socket.handshake.query['serverToken'] != 'r43xv43vi') {
        console.log(`${socket.id} kicked, reason: invalid token`);
        socket.emit("connectResult", 'invalid token');
        socket.disconnect();
        return;
    }

    var index = users.findIndex(x => x.name === socket.handshake.query['userName']);
    if (index !== -1) {
        const anotherSocket = io.sockets.connected[users[index]['id']];
        anotherSocket.emit("kicked", 'enabled another session');
        anotherSocket.disconnect();
    }

    if (users.length >= 5) {
        console.log(`${socket.id} kicked, reason: users limit`);
        socket.emit("connectResult", 'users limit');
        socket.disconnect();
        return;
    }

    socket.emit("connectResult", true);
    console.log(`${socket.id} connected`);
    users.push({ 'id': socket.id, 'name': socket.handshake.query['userName'] });
    console.log(users);

    io.sockets.emit("usersList", users);

    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} disconnected, reason: ${reason}`);
        removeUser(socket.id);
        console.log(users);

        io.sockets.emit("usersList", users);
    });

});

var server_port = process.env.PORT || 3000;
server.listen(server_port, function (err) {
    if (err) throw err
    console.log('Listening on port %d', server_port);
});