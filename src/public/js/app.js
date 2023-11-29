const socket = io()

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_message", value, roomName, ()=>{
        addMessage(`Me: ${value}`);
    });
    input.value = "";
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `이 방의 이름은 ${roomName}`;
    const form = room.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}


form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", ()=>{
    addMessage("누군가 입장했습니다.");
});

socket.on("bye", ()=>{
    addMessage("누군가 퇴장했습니다.");
});

socket.on("new_message", (msg)=> {
    addMessage(msg);
});