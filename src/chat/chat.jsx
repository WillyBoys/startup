import React, { useEffect, useState, useRef } from 'react';
import '../app.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function Chat() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const ws = useRef(null); // WebSocket reference

    const location = useLocation();
    const user = location.state?.username || localStorage.getItem('username');

    const [emojiList, setEmojiList] = useState([]);
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch('/api/session', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    navigate('/'); // Redirect to login if not authenticated
                }
            } catch (error) {
                console.error("Session check failed:", error);
                navigate('/');
            } finally {
                setIsLoading(false); // Set loading to false after checking session
            }
        }
        checkSession();
    }, [navigate]);

    useEffect(() => {
        // Initialize WebSocket connection
        ws.current = new WebSocket('ws://localhost:4001');

        ws.current.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.current.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            console.log("Received message:", messageData);

            setMessages((prevMessages) => [...prevMessages, messageData]);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        ws.current.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        return () => {
            ws.current.close(); // Close the WebSocket connection on unmount
        };
    }, []);

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
            text: newMessage,
            sender: 'self',
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
                localStorage.removeItem('username'); // Clear stored username
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
                    <h2 className="sigmas-title">{user}</h2>
                    <NavLink to="/users"><button className="sigmas">Sigmas</button></NavLink>
                    <NavLink to="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                        <button className="logout">Logout</button>
                    </NavLink>
                </nav>
                <div className="messages" ref={messagesContainerRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender === 'self' ? 'message-personal' : 'other'}`}>
                            <strong>{message.senderName}: </strong>
                            {message.text}
                        </div>
                    ))}
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