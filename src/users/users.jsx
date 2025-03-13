import React from 'react';
import '../app.css';

import { useLocation } from 'react-router-dom';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Chat } from '../chat/chat';

export function Users() {
    const location = useLocation();
    const user = location.state?.username || localStorage.getItem('username');

    return (
        <body>
            <header>
                <h1 id="title">SkibidiChat</h1>
                <img src="Logo1.png" alt="SkibidiChat Logo" id="logo"></img>
            </header>
            <main>
                <div className="user-list">
                    <nav className="chat-title">
                        <h2 className="sigmas-title">Sigmas</h2>
                        <NavLink to="/chat"><button className="logout">Return to Chat</button></NavLink>
                    </nav>
                    <ul>
                        <li className="user">{user}</li>
                        <li className="user">TheRizzler</li>
                        <li className="user">User 3</li>
                    </ul>
                </div>
            </main>
            <script src="script.js"></script>
        </body>
    );
}