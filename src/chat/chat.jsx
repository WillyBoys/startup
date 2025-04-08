import React, { useEffect, useState, useRef } from 'react';
import '../app.css';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function Chat() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const ws = useRef(null); // WebSocket reference

    const [user, setUser] = useState('');


    const [emojiList, setEmojiList] = useState([]);
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch('/api/session', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.username); // Set the current user's username
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Session check failed:", error);
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        }

        checkSession();
    }, [navigate]);

    useEffect(() => {
        if (!user) return;

        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            ws.current = new WebSocket(`ws://${window.location.hostname}:4001`);

            ws.current.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                setMessages((prev) => [...prev, messageData]);
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        }

        return () => { };
    }, [user]);


    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (isLoading) {
        return <p>Loading...</p>
    }

    async function handleEmojis() {
        if (emojiList.length === 0) {
            setEmojiPickerVisible(true); // Show loading state immediately
            try {
                const response = await fetch('https://emoji-api.com/emojis?access_key=bb33e72d890412c5f92b8dcaaea735ad7f8ef940');
                if (!response.ok) throw new Error('Failed to fetch emojis');
                const data = await response.json();
                setEmojiList(data.slice(0, 100)); // Take only first 100 emojis
            } catch (error) {
                console.error("Error fetching emojis:", error);
            }
        } else {
            // If already loaded, just toggle visibility
            setEmojiPickerVisible(true);
        }
    }

    // Function to add emoji to message
    function addEmojiToMessage(emoji) {
        setNewMessage((prev) => prev + emoji.character);
        setEmojiPickerVisible(false); // Hide emoji picker
    }

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return; // Can't send empty messages

        const messageData = {
            type: 'message',
            text: newMessage,
            senderName: user
        };

        if (ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(messageData)); // Send message via WebSocket
        } else {
            console.error("WebSocket not connected.");
        }

        setNewMessage(''); // Clear input field
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); //Prevents a new line from being added in the textarea
            handleSendMessage();
        }
    };

    // Handle the logout feature
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include', // Ensures cookies (session) are included
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                window.location.href = '/'; // Redirect to login/homepage
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <div className="chat">
                <nav className="chat-title">
                    <h2 className="sigmas-title">{user || 'Alpha Rizzler'}</h2>
                    <NavLink to="/users"><button className="sigmas">Sigmas</button></NavLink>
                    <NavLink to="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                        <button className="logout">Logout</button>
                    </NavLink>
                </nav>
                <div className="messages" ref={messagesContainerRef}>
                    {messages.map((message, index) => {
                        if (message.type === 'system') {
                            return (
                                <div key={index} className="system-message">
                                    <em>{message.text}</em>
                                </div>
                            );
                        }

                        if (message.type === 'message') {
                            return (
                                <div key={index} className={`message ${message.senderName === user ? 'message-personal' : 'other'}`}>
                                    <strong>{message.senderName}: </strong>
                                    {message.text}
                                </div>
                            );
                        }

                        return null; // Ignore unknown message types
                    })}

                    <div ref={messagesEndRef} />
                </div>
                <div className="message-box">
                    <textarea
                        type="text"
                        className="message-input"
                        placeholder="Type message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    ></textarea>
                    <button className="message-submit" onClick={handleSendMessage}>Send</button>
                    <button className="message-emoji" onClick={handleEmojis}>Emojis</button>
                </div>
                {isEmojiPickerVisible && (
                    <div className="emoji-modal">
                        <div className="emoji-picker">
                            <button className="close-btn" onClick={() => setEmojiPickerVisible(false)}>✖</button>
                            <div className="emoji-container">
                                {emojiList.map((emoji, index) => (
                                    <button key={index} className="emoji-btn" onClick={() => addEmojiToMessage(emoji)}>
                                        {emoji.character}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg"></div>
        </div>
    );
}