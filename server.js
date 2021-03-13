const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');



const app=express();
const server = http.createServer(app);
const io = socketio(server);
const botName="Kunal's Chat";

//Set Static Folder

app.use(express.static(path.join(__dirname,'public')));


//run when a client connects

io.on('connection', socket=>{
    // console.log("new connection..");
    socket.on('joinRoom',({username,room})=>{

        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',formatMessage(botName,"Welcome to Kunal's chat room"));


        //broadcast to everyone
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} joined the chat`));

        //users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    
        //when someone disconnects
        socket.on('disconnect',message=>{
            const user=userLeave(socket.id);
            if(user){

                io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
                //users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
            }
            
    
        });

    });
   
    //listen for chat message
    socket.on('chatMessage',msg=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));

    })

});



const PORT = process.env.PORT||3000;

server.listen(PORT,()=>console.log(`Server running on port : ${PORT}`));