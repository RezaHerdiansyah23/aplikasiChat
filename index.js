var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var users = {};
var usernames = [];

io.on('connection', function (socket) {
    //kalo ada yang connect, kita kasih tau ke client
    socket.broadcast.emit('newMessage', 'Someone connected');
    //ketika ada yang registet
    socket.on('registerUser', function (username) {
        if (usernames.indexOf(username) != -1) {
            socket.emit('registerRespond', false);
        } else {
            users[socket.id] = username;
            usernames.push(username);
            socket.emit('registerRespond', true);
        }
        console.log(users);
        console.log('----------------------------------------------------------------');
        console.log(usernames);
    });
    //kalo ada messages baru
    socket.on('newMessage', function (msg) {
        io.emit('newMessage', msg);
        console.log('message: ' + msg);
    });
    //kalo user disconnect
    socket.on('disconnect', function () {
        socket.broadcast.emit('newMessage', 'Someone disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on http://localhost:3000');
});