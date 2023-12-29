import React, { useState } from 'react';
import ChatMessage from './components/ChatMessage';
import Modal from './components/Modal';
import MessageInput from './components/MessageInput'; // MessageInput 컴포넌트 임포트
import './ChatRoom.css';


const ChatRoom = () => {
    const [messages, setMessages] = useState([
        { id: 0, text: "끄덕끄덕", isUser: false, deleted:false,sendTime:"09:11" },
        { id: 1, text: "안녕하세요! 어떻게 지내세요?", isUser: false, deleted:false, sendTime:"12:12" },
        { id: 2, text: "전 잘 지내죠! 당신은 어떻게 지내시나요?", isUser: true, deleted:false, sendTime:"12:12"},
        { id: 3, text: "끄적", isUser: false, deleted:false,sendTime:"12:13" },
        { id: 4, text: "끄적끄적", isUser: false, deleted:false,sendTime:"23:11" },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);


    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      };
      
    

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
          const nextId = messages.length + 1;
          const isDeletedMessage = newMessage.trim() === "삭제된 메시지입니다";
          const sendTime = getCurrentTime(); // 현재 시간을 얻음
      
          setMessages([
            ...messages, 
            { id: nextId, text: newMessage, isUser: true, deleted: isDeletedMessage, sendTime } 
          ]);
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

    const handleDeleteMessage = (type) => {
        setMessages(currentMessages => currentMessages.map(message => {
            if (message.id === selectedMessageId) {
                return { ...message, text: "삭제된 메시지입니다", deleted: true };
            }
            return message;
        }));
        setShowModal(false);
    };
    return (
        <div className="app-container">
            <div className="chat-container">
            {messages.map(message => (
                <ChatMessage 
                    key={message.id}
                    id={message.id}
                    text={message.text}
                    isUser={message.isUser}
                    sendTime={message.sendTime}
                    onLongPress={handleLongPress}
                    deleted={message.deleted}  // 'deleted' 속성 전달
                />
            ))}
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
