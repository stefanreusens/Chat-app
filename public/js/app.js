const messageTypes = {
    LEFT: 'left',
    RIGHT: 'right',
    LOGIN: 'login'
}

//Chat Stuff
const chatWindow = document.querySelector('#chat');
const messageList = document.querySelector('#messagesList');
const messageInput = document.querySelector('#messageInput');
const sendBtn = document.querySelector('#sendBtn');

//Login Stuff
let username = '';
const usernameInput = document.querySelector('#usernameInput');
const loginBtn = document.querySelector('#loginBtn');
const loginWindow = document.querySelector('#login');


const messages = []; //{author, date, content, type}

// const socket = io();
const socket = io.connect('https://becode-node-socketio-exercise.herokuapp.com/');

socket.on('message', message => {
    console.log(message);
    if(message.type !== messageTypes.LOGIN) {
        if(message.author === username) {
            message.type = messageTypes.RIGHT;
        } else {
            message.type = messageTypes.LEFT;
        }
    }

    messages.push(message);
    displayMessages();
    chatWindow.scrollTop = chatWindow.scrollHeight;
})

//take in message object, and return corresponding message HTML
const createMessageHTML = message => {
    if (message.type === messageTypes.LOGIN) {
        return `
            <p class="secondary-text text-center mb-2">${message.author} has joined the chat...</p>
        `;
    }
    return `
        <div class="message ${message.type === messageTypes.LEFT ? 'message-left' : 'message-right'}">
            <div id="message-details" class="flex mb-2">
                <p class="message-author">${message.type === messageTypes.RIGHT ? 'You' : message.author}</p>
                <p class="message-date">${message.date}</p>
            </div>
            <p class="message-content">${message.content}</p>
        </div>
    `;
};

const displayMessages = () => {
    console.log('displaying messages')
    const messagesHTML = messages
        .map(message => createMessageHTML(message))
        .join('');
    messagesList.innerHTML = messagesHTML
}

displayMessages();

//sendbtn callback
const handleClickSendBtn = e => {
    e.preventDefault();
    if(!messageInput.value) {
        return console.log('must supply a message');
    }

    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const dateString = `${hour}:${minutes}:${seconds}`;

    const message = {
        author: username,
        date: dateString,
        content: messageInput.value
    }

    sendMessage(message);

    messageInput.value = "";
}

sendBtn.addEventListener('click', handleClickSendBtn);

const sendMessage = message => {
    socket.emit('message', message);
}

//loginbtn callback
const handleClickLoginBtn = e => {
    //preventdefault of a form
    e.preventDefault();
    //set the sername and create logged in message
    if(!usernameInput.value) {
        window.alert('Please fill in a username');
    }
    username = usernameInput.value;

    sendMessage({
        author: username,
        type: messageTypes.LOGIN
    })
    //hide login and show chat window
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');
}

loginBtn.addEventListener('click', handleClickLoginBtn);