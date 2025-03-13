import React, { useEffect, useState, useRef, use } from 'react';
import '../app.css';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function Chat() {
    const location = useLocation();
    const user = location.state?.username || localStorage.getItem('username');

    // Using State to store messages
    const [messages, setMessages] = useState([
        { text: 'Heyo', sender: 'self', senderName: user },
        { text: 'What up', sender: 'other', senderName: 'TheRizzler' },
        { text: 'Skibidi Ohio Rizz', sender: 'self', senderName: user },
        { text: 'Lmao', sender: 'other', senderName: 'TheRizzler' }
    ]);

    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return; // Can't send empty messages

        const messageData = {
            text: newMessage,
            sender: 'self',
            senderName: user
        };

        setMessages(prevMessages => [...prevMessages, messageData]); // Update state with new message
        setNewMessage(''); // Clear input field

        // Websocket Placeholder
        console.log("Message to send:", messageData.text);

        // setTimeout(() => {
        //     messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        // }, 100);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); //Prevents a new line from being added in the textarea
            handleSendMessage();
        }
    };

    const handleEmojis = () => {
        // Placeholder for emoji functionality
        console.log("(: Emoji button clicked :)");
    }

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Simulated WebSocket messages
    useEffect(() => {
        const interval = setInterval(() => {
            const messageData = {
                text: 'We have been trying to reach you about your cars extended warranty',
                sender: 'other',
                senderName: 'TheRizzler'
            };

            setMessages(prevMessages => [...prevMessages, messageData]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="chat">
                <nav className="chat-title">
                    <h2 className="sigmas-title">{user}</h2>
                    <NavLink to="/users"><button className="sigmas">Sigmas</button></NavLink>
                    <NavLink to="/"><button className="logout">Logout</button></NavLink>
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
            </div>
            <div className="bg"></div>
        </div>
    );
}