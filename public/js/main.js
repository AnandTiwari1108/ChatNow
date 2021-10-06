const chatForm=document.getElementById('chat-form');
const chatMessage=document.querySelector('.chat-messages');
const roomName=document.querySelector('#room-name');
const userlist=document.querySelector('#users');
console.log(location);
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});
console.log(username,room);
//console.log(location.search);
//console.log(Qs.parse(location.search,{ignoreQueryPrefix:true}));
const socket=io();

socket.emit('joinRoom',{username,room});

socket.on('message',message =>{
    console.log(message);
    outputmessage(message);
    chatMessage.scrollTop=chatMessage.scrollHeight;
});

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();

})
function outputmessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}  <span>${message.time}</span></p><p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerText=room;
}

function outputUsers(users){
    userlist.innerHTML=`${users.map(user =>`<li>${user.username}</li>`).join('')}`;
}