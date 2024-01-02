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
        { id: 0, text: "끄덕끄덕", deleted:false,sendTime:"09:11",userId:1 },
        { id: 1, text: "안녕하세요! 어떻게 지내세요?",  deleted:false, sendTime:"12:12",userId:1 },
        { id: 2, text: "전 잘 지내죠! 당신은 어떻게 지내시나요?",  deleted:false, sendTime:"12:12",userId:2},
        { id: 3, text: "끄적",  deleted:false,sendTime:"12:13" ,userId:1},
        { id: 4, text: "끄적끄적",  deleted:false,sendTime:"23:11" ,userId:1},
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


  
      // 컴포넌트 마운트 시 소켓 연결을 설정합니다.
      useEffect(() => {
          // 소켓 인스턴스를 생성하고 연결합니다.
          const newSocket = io(SERVER_URL);
          setSocket(newSocket);
  
          // 서버로부터 메시지를 받을 리스너를 설정합니다.
          newSocket.on('chat message', (message) => {
              setMessages((currentMessages) => [...currentMessages, message]);
          });
  
          // 컴포넌트 언마운트 시 소켓 연결을 정리합니다.
          return () => {
              newSocket.close();
          };
      }, []);
  
      const handleSendMessage = () => {
          if (newMessage.trim() !== '') {
              // 메시지 객체를 생성합니다.
              const messageData = {
                  text: newMessage,
                  userId: numericUserId,
                  sendTime: getCurrentTime()
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
        {messages.map(message => (
            <ChatMessage 
                key={message.id}
                id={message.id}
                text={message.text}
                userId={message.userId}
                currentUser={numericUserId} // 현재 로그인한 사용자의 userId를 전달
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
