import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ChatMessage from './components/ChatMessage';
import Modal from './components/Modal';
import { useParams } from 'react-router-dom';
import MessageInput from './components/MessageInput';
import './ChatRoom.css';

const SERVER_URL = 'http://172.30.16.25:3030';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const messagesEndRef = useRef(null);
    const [socket, setSocket] = useState(null);

    const { userId } = useParams();
    const numericUserId = parseInt(userId, 10);

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        newSocket.on('previous messages', (previousMessages) => {
            setMessages(previousMessages.map((m) => ({ ...m, id: m._id })));
        });

        newSocket.on('chat message', (message) => {
            setMessages((currentMessages) => {
                if (!currentMessages.find((m) => m._id === message._id)) {
                    return [...currentMessages, { ...message, id: message._id }];
                }
                return currentMessages;
            });
        });

        newSocket.on('delete message', (messageId) => {
            setMessages((currentMessages) => {
                return currentMessages.filter((m) => m._id !== messageId);
            });
        });

        return () => {
            newSocket.off('previous messages');
            newSocket.off('chat message');
            newSocket.close();
        };
    }, [SERVER_URL]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('ko-KR', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const messageData = {
                text: newMessage,
                userId: userId.toString(),
                sendTime: getCurrentTime(),
                deleted: false,
            };

            socket.emit('chat message', messageData);
            setNewMessage('');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLongPress = (id) => {
        const selectedMessage = messages.find(message => message.id === id);
        if (selectedMessage && !selectedMessage.deleted) {
            setShowModal(true);
            setSelectedMessageId(id);
        }
    };

    const handleDeleteMessage = () => {
        const messageToDelete = messages.find(message => message._id === selectedMessageId);
        if (messageToDelete && !messageToDelete.deleted) {
            socket.emit('delete message', messageToDelete._id);
            setMessages(currentMessages => currentMessages.map(message => {
                if (message._id === messageToDelete._id) {
                    return { ...message, text: "삭제된 메시지입니다", deleted: true };
                }
                return message;
            }));
            setShowModal(false);
        }
    };

    return (
        <div className="app-container">
            <div className="chat-container">
                {messages.map((message) => (
                    <ChatMessage 
                        key={message._id}
                        id={message._id}
                        text={message.text}
                        userId={message.userId}
                        currentUser={numericUserId}
                        sendTime={message.sendTime}
                        onLongPress={handleLongPress}
                        deleted={message.deleted}
                    />
                ))}
                {/* 스크롤이 최하단으로 이동하도록 빈 div를 추가합니다. */}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput 
                newMessage={newMessage} 
                setNewMessage={setNewMessage} 
                handleSendMessage={handleSendMessage} 
            />
            {showModal && <Modal onClose={handleCloseModal} onDelete={handleDeleteMessage} />}
        </div>
    );
};

export default ChatRoom;
