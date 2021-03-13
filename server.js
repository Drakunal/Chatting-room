const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage=require('./utils/messages');


const app=express();
const server = http.createServer(app);
const io = socketio(server);
const botName="Kunal's Chat";

//Set Static Folder

app.use(express.static(path.join(__dirname,'public')));


//run when a client connects

io.on('connection', socket=>{
    console.log("new connection..");
    socket.emit('message',formatMessage(botName,"Welcome to Kunal's chat room"));


    //broadcast to everyone
    socket.broadcast.emit('message',formatMessage(botName,"A user joined the chat"));

    //when someone disconnects
    socket.on('disconnect',message=>{
        io.emit('message',formatMessage(botName,"A user has left the chat"));

    });
    //listen for chat message
    socket.on('chatMessage',msg=>{
        io.emit('message',formatMessage('user',msg));

    })

});



const PORT = process.env.PORT||3000;

server.listen(PORT,()=>console.log(`Server running on port : ${PORT}`));