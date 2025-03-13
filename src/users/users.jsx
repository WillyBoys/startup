import React, { useState, useEffect } from 'react';
import '../app.css';

import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function Users() {
    const location = useLocation();
    const user = location.state?.username || localStorage.getItem('username');

    //Using state to store users
    const [users, setUsers] = useState([
        { name: user },
        { name: 'TheRizzler' },
        { name: 'User 3' },
        { name: 'User 4' },
        { name: 'User 5' }
    ]);

    //Simulate users joining and leaving
    //WILL BE CHANGED TO WEBSOCKET AND DATABASE
    useEffect(() => {
        const interval = setInterval(() => {
            setUsers(prevUsers => {
                const randomUser = `User ${Math.floor(Math.random() * 10)}`;
                const userExists = prevUsers.some(u => u.name === randomUser);

                // 50% chance to add or remove a user
                if (Math.random() > 0.5) {
                    // If user doesn't exist, add them
                    if (!userExists) {
                        return [...prevUsers, { name: randomUser }];
                    }
                } else {
                    // If more than one user in the list, remove one at random (excluding the first user)
                    if (prevUsers.length > 1) {
                        const removeIndex = Math.floor(Math.random() * (prevUsers.length - 1)) + 1;
                        return prevUsers.filter((_, index) => index !== removeIndex);
                    }
                }

                return prevUsers; // No change
            });
        }, 5000); // Runs every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);



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
                        {users.map((user, index) => (
                            <li key={index} className="user">{user.name}</li>
                        ))}
                    </ul>
                </div>
            </main>
        </body>
    );
}