const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


//Server the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
})

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

    socket.on('message', message => {
        console.log('message', message);
        //Broadcast the message to everyone!
        io.emit('message', message);
    })
})

server.listen(process.env.PORT || 3000);
console.log('listening on port 3000');