import React, { useState, useEffect } from 'react';
import '../app.css';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function Users() {
    const navigate = useNavigate();
    const user = location.state?.username || localStorage.getItem('username');

    //Using state to store users THIS IS HARD CODED
    const [users, setUsers] = useState([
        { name: user },
    ]);

    useEffect(() => {
        if (!user) {
            navigate('/');  // Redirect if not logged in
            return;
        }

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
            ws.send(JSON.stringify({ type: 'leave', username: user }));
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
                        {users.map((user, index) => (
                            <li key={index} className="user">{user.name}</li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}