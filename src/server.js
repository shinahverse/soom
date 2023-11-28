import http from "http";
import WebSocket from "ws";
import express from 'express';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("연결중 http://localhost:3000");
//app.listen(3000, handleListen);
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const sockets = [];

wss.on("connection", (socket)=>{
    sockets.push(socket);
    socket["nickname"] = "익명";
    console.log("브라우저와 연결되었습니다.");
    socket.on("close", ()=> console.log("서버>서버와 연결이 끊겼습니다."));
    // socket.on("message", (message)=>{
    socket.on("message", (msg)=>{
        const message = JSON.parse(msg);
        // console.log(message.type, message.payload);
        // console.log(`[서버] ${message}`);
        // socket.send(`[서버] ${message}`);
        //sockets.forEach(aSocket => aSocket.send(`${message}`));
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${message.payload}`));
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}:${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
    // socket.send("hello!");
});
server.listen(3000, handleListen);