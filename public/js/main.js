const chartForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

//message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//messages
chartForm.addEventListener('submit',e=>{
    e.preventDefault();
    //get message
    const msg = e.target.elements.msg.value;


    // console.log(msg);

    //emit message to the server

    socket.emit('chatMessage',msg);

    //clear the input box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//output message to DOM

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}