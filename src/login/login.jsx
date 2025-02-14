import React from 'react';
import '../app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Chat } from '../chat/chat';

export function Login() {
    return (
        <BrowserRouter>
            <main>
                <div class="login-page">
                    <div class="form">
                        <form class="register-form">
                            <input type="text" placeholder="name" />
                            <input type="password" placeholder="password" />
                            <input type="text" placeholder="email address" />
                            <NavLink type="button" className="nav-link" to='chat'>create</NavLink>
                            <p class="message">Already registered? &nbsp;<a href="#">Sign In</a></p>
                        </form>
                        <form class="login-form">
                            <input type="text" placeholder="username" />
                            <input type="password" placeholder="password" />
                            <NavLink type="button" className="nav-link" to='chat'>create</NavLink>
                            <p class="message">Not registered? &nbsp;<a href="#">Create an account</a></p>
                        </form>
                    </div>
                </div>
            </main>
        </BrowserRouter>
    );
}