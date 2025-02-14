import React from 'react';
import '../app.css';
//import '../script.js';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Chat } from '../chat/chat';

export function Login() {
    return (
        <main>
            <div className="login-page">
                <div className="form">
                    <form className="register-form">
                        <input type="text" placeholder="name" />
                        <input type="password" placeholder="password" />
                        <input type="text" placeholder="email address" />
                        <NavLink to="/chat">
                            <button type="button" onclick="window.location.href='chat.html'">create</button>
                        </NavLink>
                        <p className="message">Already registered? &nbsp;<a href="#">Sign In</a></p>
                    </form>
                    <form className="login-form">
                        <input type="text" placeholder="username" />
                        <input type="password" placeholder="password" />
                        <NavLink to="/chat">
                            <button type="button" onclick="window.location.href='chat.html'">login</button>
                        </NavLink>
                        <p className="message">Not registered? &nbsp;<a href="#">Create an account</a></p>
                    </form>
                </div>
            </div>
        </main>
    );
}