import express from 'express'
import {Server} from 'socket.io';

const app = express();

const PORT = 3030;

const expressServer = app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // 모든 클라이언트에게 메시지 전송

    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
