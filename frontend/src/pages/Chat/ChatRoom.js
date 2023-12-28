import React, { useState } from 'react';
import ChatMessage from './components/ChatMessage';
import Modal from './Modal';
import MessageInput from './MessageInput'; // MessageInput 컴포넌트 임포트
import './ChatRoom.css';


const ChatRoom = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "안녕하세요! 어떻게 지내세요?", isUser: false, deleted:false },
        { id: 2, text: "전 잘 지내죠! 당신은 어떻게 지내시나요?", isUser: true, deleted:true },
        { id: 3, text: "끄덕끄덕", isUser: false, deleted:false },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

   const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
        const nextId = messages.length + 1;
        // 새 메시지가 "삭제된 메시지입니다"와 동일한지 확인
        const isDeletedMessage = newMessage.trim() === "삭제된 메시지입니다";
        setMessages([...messages, { id: nextId, text: newMessage, isUser: true, deleted: isDeletedMessage }]);
        setNewMessage('');
    }
};

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
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
