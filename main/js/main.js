const chatForm = document.getElementById('chat-form');//determine a variable for the chat area
const chatMessages = document.querySelector('.chat-messages');//determine a variable for each chat messages from html
const roomName = document.getElementById('room-name');//determine a variable for room name input
const userArray = document.getElementById('users');//determine a variable for users list
const roomList = document.getElementById('rooms');//determine a variable for rooms list
let selectedID = 0;// a global variable for selected user
let selectedRoom;// a global variable for selected room
const socket = io(); //// a global variable for io()
let currentRoom = "";// a global variable for current room
let fileBool = false;// a bool variable for file
let roomBool = false;// a a bool variable for room
let personBool = false;// a bool variable for person

let choosedFile
//Get user name from the site url
var { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join a chat room

socket.emit('joinRoom', { username, room }); //emit current room 

//listenin from server rooms users
socket.on('roomUsers', ({ users }) => {
    outputUsers(users)
})
//listenin from server when a room creating 
socket.on('roomNot', ({ rooms }) => {
    console.log("room oluşturdum")
    console.log(rooms)
    outputRooms(rooms)
})

// get this user
socket.on('thisUser', ({ user }) => {
    console.log(user.username)
})
//get Client to client messages from server
socket.on('message', message => {
    console.log(message);

    outputMessage(message);

    //scrool
    chatMessages.scrollTop = chatMessages.scrollHeight;
})
//get rooms messages from server
socket.on('messageRoom', message => {
    console.log("ilk mesaj")
    console.log(message);

    outputMessage(message);

    //scrool
    chatMessages.scrollTop = chatMessages.scrollHeight;
})
//get rooms messages from server
socket.on('fileMessage', ({ filename, selectedID, data }) => {
    console.log(filename)
    console.log(selectedID)
    //outputMessage(filename);
    //downloading a sending file
    downloadURI(data, filename)
})
//chat form submit event
chatForm.addEventListener('submit', e => {
    e.preventDefault();
    choosedFile = document.getElementById("fileChooser").files[0];
    //get msg txt

    
    //emmiting a room message to server
    if (roomBool === true) {
        const msg = e.target.elements.msg.value;
        //sending room messages to server
        socket.emit('roomMessage', { selectedRoom, from: username, msg })
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
        roomBool = false
    }
    //emitting a file to server
    else if (fileBool === true) {
        sendFile(choosedFile, username, selectedID)
        fileBool = false
    }
    //emmiting a message to server
    else if (fileBool === false) {
        const msg = e.target.elements.msg.value;
        //defining a time variable for current message
        var date = new Date()
        let time = date.getHours() + ":" + date.getMinutes()
        //sending client to client message to server
        socket.emit('chatMessage', {selectedID, msg, from: username });
        console.log(selectedID);
        //output message current message
        outputMessage({ username, text: msg, time })
        //clear input area
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
        personBool = false
    }
    // Clear input

})
/*
*this part of code the onclick method for crete room button
 */
document.getElementById("addRoom").onclick = () => {

    var temproom = document.getElementById("roomName").value
    console.log("temproom" + temproom)
    //we emmiting a room name to server
    socket.emit("roomOpened", temproom)
    console.log("room oluşturdum")

}

//defining file chooser display option
document.getElementById("fileChooser").style.display = "none"

document.getElementById("send_file").onclick = () => {
    //setting file chooser display option to visible
    document.getElementById("fileChooser").click();
    fileBool = true;

}


//defining an emoji area
let emojiBtn = false
//defining file chooser display option none
document.getElementById('emoji_box').style.display = "none"
//button on click option for emoji button
document.getElementById('emoji_btn').onclick = () => {
    if (emojiBtn) {
        //defining file chooser display option none
        document.getElementById('emoji_box').style.display = "none"
        emojiBtn = false
    }
    else {
        //defining file chooser display option inline-block
        document.getElementById('emoji_box').style.display = "inline-block"
        emojiBtn = true
    }
}
// this area selecting emoji's info
let message = document.getElementById('msg')//defining emoji variable
document.querySelector('emoji-picker')
    .addEventListener('emoji-click', event => {
        console.log(event.detail)
        //getting emojis value + emoji unicode
        document.getElementById('msg').value = message.value + event.detail.unicode
    });


/*
* this function written by converting a file to base 64 encoder 
for sending on server
*/
const convertToBase64 = file => new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => resolve(fr.result);
    fr.onerror = error => reject(error)

})
/*
*this function sendinf our file infıs that are converting via base64encoder */
async function sendFile(file, username, selectedID) {
    convertToBase64(file).then(data => {
        //emmiting our file infos to server
        socket.emit('fileCom', { filename: file.name, selectedID, data })
    }).catch();
    console.log(file)
}
/**
 * this function downloading our base64 encoded file infos to exact file
 */
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}
//output a message to dom 
/**
 * this function outputing our messages on our screen
 * 
 */
function outputMessage(message) {
    //creating a div  element for message
    const div = document.createElement('div');
    //adding an element on message div
    div.classList.add('message');
    //set that div innethtml
    div.innerHTML = '<p class="meta">' + message.username + '  ' + '<span>' + message.time + ' ' + '</span></p><p class="text">' + message.text + ' </p>';
    //adding this div via appendchild
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    //displaying roomName
    roomName.innerText = room
}
function outputUsers(users) {
    /*userArray.innerHTML= `
    ${users.map(user => `<li id='${user.id}'>${user.username}</li>`).join()}`*/
    userArray.innerHTML = '';
    for (let user of users) {
        //displaying user names on screen
        //userArray.innerHTML+=`<li id='${user.id}'>${user.username}</li>`
        if (userArray.innerHTML.includes(user.username) === false) {
            //by this code ı depend unique elements on users
            var list = document.createElement("li");
            list.setAttribute("id", user.id)
            //setting element attribute id with user.id and each id is unique
            //set innerhtml
            list.innerHTML = user.username;
            //adding this div via appendchild
            userArray.appendChild(list);
            document.getElementById(user.id).onclick = () => {
                console.log(user.id)
                /**
                 * this part of code user id on click event when u click on u can get this user id
                 */
                selectedID = user.id
                personBool = true
            }
        }

    }
}
function outputRooms(rooms) {
    console.log("room oluşturdum")
    roomList.innerHTML = '';
    console.log(rooms)
    /**
     * in this part of code we display our room 
     */
    rooms.forEach(room => {
        //we have  foreach loop on rooms list
        console.log(room)
        //creating a li element
        var list = document.createElement("li");
        //set id attribute for each room 
        list.setAttribute("id", room.roomName)
        list.innerHTML = room.roomName
        //apending child for each room
        roomList.appendChild(list);
        document.getElementById(room.roomName).onclick = () => {
            roomBool = true;
               /**
                 * this part of code room name on click event when u click on u can join a room
                 */
            currentRoom = room.roomName
            selectedRoom = room.roomName
            const msg="a user has joined "+ selectedRoom +" room."
            console.log("currentRoom" + currentRoom)
            socket.emit("joinRoom", { username, selectedRoom });
            socket.emit('roomMessage', { selectedRoom, from: "System", msg })
        }
    });

}




