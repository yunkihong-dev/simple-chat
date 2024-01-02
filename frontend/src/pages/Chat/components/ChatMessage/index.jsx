import React, { useState, useEffect } from 'react';
import './ChatMessage.css';

const ChatMessage = ({ id, text, userId, onLongPress, deleted, sendTime, currentUser }) => {
    const [timer, setTimer] = useState(null);
    // Determine if the message belongs to the current user for styling
    const isCurrentUserMessage = userId === currentUser;
    const messageClass = isCurrentUserMessage ? 'message user' : 'message other';
    const messageStyle = deleted ? `${messageClass} deleted` : messageClass;
    const texts = deleted ? "삭제된 내용입니다." : text;
  
    const formatSendTime = () => {
        const [hours, minutes] = sendTime.split(":").map(Number);
        const isPM = hours >= 12;
        const adjustedHours = hours % 12 || 12;
        const formattedHours = adjustedHours.toString().padStart(2, '0');
        const suffix = isPM ? '오후' : '오전';
        return `${suffix} ${formattedHours}:${minutes}`;
    };

    const sendTime1 = formatSendTime();

    const handleMouseDown = () => {
        // Adjust this logic to handle events for the current user
        if (isCurrentUserMessage) {
            const newTimer = setTimeout(() => onLongPress(id), 500);
            setTimer(newTimer);
        }
    };

    const handleMouseUp = () => {
        clearTimeout(timer);
    };

    useEffect(() => {
        return () => clearTimeout(timer);
    }, [timer]);

    return (
        <div className={`message-wrapper ${messageStyle}`}>
            {isCurrentUserMessage ? (
                    <div className="message-userId"></div> // 현재 사용자의 메시지일 때 "나"라고 표시
                ) : (
                    <div className="message-userId">{userId}</div> // 다른 사용자의 메시지일 때 userId를 표시
                )}
            <div className="message-container" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                
                <div className="message-content">{texts}</div>
                
            </div>
            {!deleted && (
                <div className={`message-time-container ${messageStyle}`}>
                    <div className="message-time">{sendTime1}</div>
                </div>
            )}
        </div>
    );
};

export default ChatMessage;