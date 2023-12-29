import React from 'react';
import './Modal.css';

const Modal = ({ onClose, onDelete }) => {
    // 모달의 내용을 클릭했을 때 이벤트 버블링 방지
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <button onClick={() => onDelete('self')}>나한테서만 삭제하기</button>
                <button onClick={() => onDelete('all')}>모든 사람들에게서 삭제하기</button>
            </div>
        </div>
    );
};

export default Modal;
