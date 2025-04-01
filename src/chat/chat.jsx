import React, { useEffect, useState, useRef } from 'react';
import '../app.css';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function Chat() {
    const location = useLocation();
    const user = location.state?.username || localStorage.getItem('username');

    // Using State to store messages
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const ws = useRef(null); // WebSocket reference

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

    const [emojiList, setEmojiList] = useState([]);
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);

    async function handleEmojis() {
        try {
            const response = await fetch('https://emojihub.xyz/api/all');
            const data = await response.json();
            setEmojiList(data); // Save emojis in state
            setEmojiPickerVisible(true); // Show emoji picker UI
        } catch (error) {
            console.error("Error fetching emojis:", error);
        }
    }

    // Function to add emoji to message
    function addEmojiToMessage(emoji) {
        setNewMessage((prev) => prev + emoji.character);
        setEmojiPickerVisible(false); // Hide emoji picker
    }

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Simulated WebSocket messages
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const messageData = {
    //             text: 'We have been trying to reach you about your cars extended warranty',
    //             sender: 'other',
    //             senderName: 'TheRizzler'
    //         };

    //         setMessages(prevMessages => [...prevMessages, messageData]);
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, []);

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