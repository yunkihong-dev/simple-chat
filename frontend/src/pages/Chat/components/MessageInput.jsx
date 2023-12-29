import React from 'react';

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage }) => {
    
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="message-input-container">
            <input 
                type="text" 
                value={newMessage} 
                onChange={handleInputChange} 
                onKeyPress={handleKeyPress}
                placeholder="메시지 입력..."
            />
            <button onClick={handleSendMessage}>보내기</button>
        </div>
    );
};

export default MessageInput;
