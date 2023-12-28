import React, { useState, useEffect } from 'react';
import './ChatMessage.css';

const ChatMessage = ({ id, text, isUser, onLongPress,deleted }) => {
    const [timer, setTimer] = useState(null);
    const messageClass = isUser ? 'message user' : 'message other';
    const messageStyle = deleted ? `${messageClass} deleted` : messageClass;
    const texts = deleted ? "삭제된 내용입니다." : text;
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
        <div 
            className={messageStyle}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // 마우스가 메시지 밖으로 이동할 경우에도 처리
        >
            {texts}
        </div>
    );
};

export default ChatMessage;
