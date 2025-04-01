import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Chat } from './chat/chat';
import { Users } from './users/users';

export default function App() {
    const [user, setUser] = React.useState(localStorage.getItem('username') || null);
    return (
        <BrowserRouter>
            <div>
                <header>
                    <h1 id="title">SkibidiChat</h1>
                    <img src="Logo1.png" alt="SkibidiChat Logo" id="logo"></img>
                </header>

                <Routes>
                    <Route path='/' element={<Login setUser={setUser} />} exact />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer>
                    <div className="footer-github">
                        <a href="https://github.com/WillyBoys/startup">Github Here!</a>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404 Not Found: Address unknown</main>;
}