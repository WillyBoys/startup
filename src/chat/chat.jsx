import React from 'react';
import '../app.css';

import { useLocation } from 'react-router-dom';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from '../login/login';
import { Users } from '../users/users';

export function Chat() {
    const location = useLocation();
    const user = location.state?.username || localStorage.getItem('username');

    return (
        <body>
            <header>
                <h1 id="title">SkibidiChat</h1>
                <img src="Logo1.png" alt="SkibidiChat Logo" id="logo"></img>
            </header>
            <div className="chat">
                <nav className="chat-title">
                    <h2 className="sigmas-title">{user}</h2>
                    <NavLink to="/users"><button className="sigmas">Sigmas</button></NavLink>
                    <NavLink to="/"><button className="logout">Logout</button></NavLink>
                </nav>
                <div className="messages">
                    <div className="message message-personal">Heyo</div>
                    <div className="message">What up</div>
                    <div className="message message-personal">Skibidi Ohio Rizz</div>
                    <div className="message">Lmao</div>
                </div>
                <div className="message-box">
                    <textarea type="text" className="message-input" placeholder="Type message..."></textarea>
                    <button className="message-submit">Send</button>
                    <button className="message-emoji">Emojis</button>

                </div>
            </div>
            <div className="bg"></div>
        </body>
    );
}