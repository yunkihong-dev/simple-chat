import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const app = express();
const PORT = 3030;
const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: ["http://localhost:3000","http://172.30.16.25:3000"],
        methods: ["GET", "POST"]
    }
});

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 메시지 스키마와 모델
const messageSchema = new mongoose.Schema({
    text: String,
    userId: String,
    sendTime: String,
    deleted:Boolean
});

const Message = mongoose.model('Message', messageSchema);

io.on('connection', (socket) => {
    console.log('New client connected');
        // 이전 메시지 불러오기 (프로미스 방식으로 변경)
        Message.find().sort({ createdAt: 1 })
        .then(messages => {
            socket.emit('previous messages', messages);
        })
        .catch(err => {
            console.error('Error retrieving messages:', err);
        });

        socket.on('chat message', (msg) => {
            const message = new Message(msg);
            message.save().then((savedMessage) => {
                io.emit('chat message', savedMessage); // 저장된 메시지와 함께 방송
            });
        });
        socket.on('delete message', (messageId) => {
            Message.findByIdAndUpdate(messageId, { deleted: true }, { new: true })
            .then((updatedMessage) => {
                // 모든 클라이언트에게 삭제 이벤트 방송
                io.emit('message deleted', updatedMessage);
                console.log('Message deleted event emitted');
            })
            .catch(err => {
                console.error('Error updating message:', err);
            });
        });
        
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});