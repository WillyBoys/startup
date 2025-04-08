import React, { useState, useEffect } from 'react';
import '../app.css';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function Users() {
    const navigate = useNavigate();

    //Using state to store users THIS IS HARD CODED
    const [user, setUser] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchSession() {
            try {
                const response = await fetch('/api/session', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.username);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Session check failed:", error);
                navigate('/');
            }
        }

        fetchSession();
    }, [navigate]);


    useEffect(() => {
        if (!user) { return; }

        const ws = new WebSocket('ws://localhost:4001');

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'join', username: user }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'updateUsers') {
                setUsers(data.users);
            }
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'leave', username: user }));
            }
            ws.close();
        };
    }, [user, navigate]);

    return (
        <div>
            <main>
                <div className="user-list">
                    <nav className="chat-title">
                        <h2 className="sigmas-title">Sigmas</h2>
                        <NavLink to="/chat"><button className="logout">Return to Chat</button></NavLink>
                    </nav>
                    <ul>
                        {users.map((u, index) => (
                            <li key={index} className={`user ${u.name === user ? 'current-user' : ''}`}>
                                {u.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}