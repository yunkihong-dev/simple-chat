import React, { useState } from 'react';
import './LoginForm.css';
const LoginForm = (e) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    const onLogin = (e)=>{
        if(username === "test" && password === "test"){
            alert("test 회원님 반갑습니다.")
        }else if(username === "1" && password === "1"){
            alert("1 회원님 반갑습니다.")
        }else{
            alert("뉘신지..")
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>사용자 이름:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default LoginForm;
