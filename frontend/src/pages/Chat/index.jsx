import React, { useState,useEffect } from 'react';
import io from 'socket.io-client';
import ChatMessage from './components/ChatMessage';
import Modal from './components/Modal';
import { useParams } from 'react-router-dom';
import MessageInput from './components/MessageInput';
import './ChatRoom.css';

const SERVER_URL = 'http://localhost:3030';


const ChatRoom = () => {
    const [messages, setMessages] = useState([
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const [socket, setSocket] = useState(null);

    const getCurrentTime = () => {
        const now = new Date();
        // 24시간 형식으로 시간을 반환하도록 옵션을 설정.
        return now.toLocaleTimeString('ko-KR', {
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit'
        });
      };
      
      const { userId } = useParams();
      const numericUserId = parseInt(userId, 10);


  
      useEffect(() => {
        // 소켓 인스턴스를 생성하고 연결
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);
    
        // 이전 메시지를 불러오는 이벤트 리스너
        newSocket.on('previous messages', (previousMessages) => {
            setMessages(previousMessages.map((m) => ({ ...m, id: m._id }))); // MongoDB에서 반환된 _id를 사용합니다.
        });
    
        // 새 메시지를 받는 이벤트 리스너
        newSocket.on('chat message', (message) => {
            setMessages((currentMessages) => {
            // MongoDB에서 반환된 _id를 사용하여 중복을 확인합니다.
            if (!currentMessages.find((m) => m._id === message._id)) {
                return [...currentMessages, { ...message, id: message._id }];
            }
            return currentMessages;
            });
        });
        
    
        // 컴포넌트 언마운트 시 이벤트 리스너를 해제하고 소켓 연결을 닫습니다.
        return () => {
            newSocket.off('previous messages');
            newSocket.off('chat message');
            newSocket.close();
        };
    }, [SERVER_URL]); // SERVER_URL이 변경될 경우에만 이 이펙트를 다시 실행합니다.
    
  
    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
          // 메시지 객체를 생성합니다.
          const messageData = {
            text: newMessage,
            userId: numericUserId.toString(),
            sendTime: getCurrentTime(),
          };
      
          // 서버에 'chat message' 이벤트로 메시지를 보냅니다.
          socket.emit('chat message', messageData);
      
          // 입력 필드를 초기화합니다.
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
        {messages.map((message) => (
            <ChatMessage 
                key={message.id} // MongoDB 문서의 고유한 _id를 key prop으로 사용
                id={message.id}
                text={message.text}
                userId={message.userId}
                currentUser={numericUserId}
                sendTime={message.sendTime}
                onLongPress={handleLongPress}
                deleted={message.deleted}
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
