const express = require('express');
//defining exprees requrie
const http = require('http');
//defining http requrie
const app = express(); 
//defining exprees variable called app
const path = require('path');
//defining path requrie
const { disconnect } = require('process'); 
//defining process requrie
const socketio = require('socket.io');
//defining socket.io requrie
const formatMessage = require('./utils/message') 
//defining formatMessage requrie for writting a message with exact 
const server = http.createServer(app);//creating a server variable
const io = socketio(server);//define a io variable for listening sending operations
const { userJoin, getCurrentUser, getRoomUsers, userLeave, getUser } = require('./utils/user')
//getting user class method via require
const{createRoom,getRooms}= require('./utils/room')
var systemName = 'System'
app.use(express.static(path.join(__dirname, 'main')));
// run a client connected
io.on('connection', socket => {
    //listening connection
    socket.on('joinRoom', ({ username, room }) => {
        // listening users join room
        const user = userJoin(socket.id, username, room)
        //create a user when a user connect
        socket.join(user.room);
        //socket . join operations
        socket.emit('message', formatMessage(systemName, 'Welcome to Your App'));
        //socket . emit for when user join we send a message from server 
        console.log('socket.id', socket.id)
        //Broadcast when a user join
        socket.broadcast.emit('message', formatMessage(systemName, `${user.username} has joined the chat`));
        //sending client room users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        //sending client to exact users
        io.to(user.id).emit('thisUser', {
            user: getUser(user.id)
        })
    })


    //Listen message
    socket.on('chatMessage', ({selectedID,msg,from}) => {
        /**
         * this part of code listening client to client com
         */
        console.log(selectedID)
        //getting current user
        let user = getCurrentUser(selectedID);
        //sending message to current user
        io.to(user.id).emit('message', formatMessage(from, msg));
        console.log(user)

    });

    socket.on('roomMessage',({selectedRoom,from, msg})=>{
        /**
         * this part of code listening in room communication
         */
        console.log("room ilk message")
        socket.join(selectedRoom);
        //sending a message to current room
        io.to(selectedRoom).emit('messageRoom',formatMessage(from, msg));
        console.log(msg)
    })

    socket.on('fileCom',({filename,selectedID,data}) =>{
        /**
         * this part of code listening in file communication
         */
        console.log("server"+filename)
        let user = getCurrentUser(selectedID);
        //sending a message to fileMessage
        io.to(user.id).emit('fileMessage',{filename,selectedID,data})
    });
   
    socket.on('roomOpened',(temproom)=>{
          /**
         * this part of code listening in open room
         */
        createRoom(temproom)
        //and emmit this roomname
        io.emit('roomNot',{rooms : getRooms()})
    });
    
    //Broadcast when a user left
    socket.on('disconnect', () => {
          /**
         * this part of code listening in when a user disconnect
         */
        const user = userLeave(socket.id);
        console.log("disconnect oldu")
        //and emmit disconnect message
        io.emit('message', formatMessage(systemName, 'A user has left just before'));
        /*
         * emitting this message rooms users
         */
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
});
// define port variable
const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log('server running on port', PORT));