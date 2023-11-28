const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const messageList = document.querySelector("ul");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open", ()=>{
    console.log("서버와 연결되었습니다.");
})

socket.addEventListener("message", (message)=>{
    console.log("방금 받은 메시지: ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.appendChild(li);
})

socket.addEventListener("close", ()=>{
    console.log("서버와 연결이 끊겼습니다.");
})

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    // socket.send(input.value);
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    // socket.send(input.value);
    // socket.send({
    //     type:"nickname",
    //     payload: input.value
    // });
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
