const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const messageFormat=require('./utils/message');
const {userJoin,getcurrentUser,userLeave,getRoomUsers}=require('./utils/user');
const app=express();
const server=http.createServer(app);
const io=socketio(server);

io.on('connection',socket =>{
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);    
        socket.join(user.room);


        //display message only to client
        socket.emit('message',messageFormat('ChatNow-BOT','Welcome to our chatting app'));
        //display message to all user except current one
        socket.broadcast.to(user.room).emit('message',messageFormat('ChatNow-BOT',`${username} is enter the room`));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    });
    //when user left the room
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.emit('message',messageFormat('ChatNow-BOT',`${user.username} left the chat`));
        }
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    });

    //Listning for chatMessage
    socket.on('chatMessage',msg=>{
        const user=getcurrentUser(socket.id);

        io.to(user.room).emit('message',messageFormat(user.username,msg));
    });
});
app.use(express.static(path.join(__dirname,'public')));
const port=3000 || process.env.port;
server.listen(port,()=>console.log(`Listning on port ${port}`));