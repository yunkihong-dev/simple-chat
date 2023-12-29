import React, { useState, useEffect } from 'react';
import './ChatMessage.css';

const ChatMessage = ({ id, text, isUser, onLongPress, deleted, sendTime }) => {
    const [timer, setTimer] = useState(null);
    const messageClass = isUser ? 'message user' : 'message other';
    const messageStyle = deleted ? `${messageClass} deleted` : messageClass;
    const texts = deleted ? "삭제된 내용입니다." : text;
    const sendTime1 = sendTime.split(":")[0] >= 12? sendTime.split(":")[0] >= 22? (sendTime.split(":")[0]-12)+":"+sendTime.split(":")[1]+" 오후" :"0"+(sendTime.split(":")[0]-12)+":"+sendTime.split(":")[1]+" 오후": sendTime+" 오전";
    const handleMouseDown = () => {
        // 사용자 메시지에 대해서만 롱 클릭 처리
        if (isUser) {
            // 롱 클릭 타이머 설정 (예: 500ms)
            const newTimer = setTimeout(() => onLongPress(id), 500);
            setTimer(newTimer);
        }
    };

    const handleMouseUp = () => {
        // 마우스 버튼이 놓이면 타이머 취소
        clearTimeout(timer);
    };

    useEffect(() => {
        return () => {
            // 컴포넌트가 언마운트될 때 타이머 정리
            clearTimeout(timer);
        };
    }, [timer]);



    return (
        <div className={`message-wrapper ${messageStyle}`}>
        <div className="message-container" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div className="message-content">{texts}</div>
        </div>
        {!deleted && <div className={`message-time-container ${messageStyle}`}>
            <div className="message-time" >{sendTime1}</div>
        </div>}
    </div>
    );
};

export default ChatMessage;
