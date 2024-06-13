import React, { useState, useEffect } from "react";
import axios from 'axios';

const ChatBox = ({ selectedProduct, messages: initialMessages, currentUserId }) => {
    const [messages, setMessages] = useState(initialMessages || []);
    const [newMessage, setNewMessage] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMessages(initialMessages || []);
    }, [initialMessages]);

    const generateId = () => {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() !== "") {
            const messageObject = {
                text: newMessage,
                messageType: selectedMessage ? "reply" : "sent",
                userId: currentUserId,
                productId: selectedProduct._id,
                replyToId: selectedMessage?.id,
                timestamp: new Date() // Set the current date and time
            };
            setMessages([...messages, messageObject]);
            setNewMessage("");
            setSelectedMessage(null);
            setLoading(true);
            try {
                await axios.post('http://localhost:7000/message', messageObject);
            } catch (error) {
                console.error("Error", error);
            }
            setLoading(false);
        }
    };

    const handleSelectMessage = (message) => {
        if (selectedMessage && selectedMessage.id === message.id) {
            setSelectedMessage(null);
        } else {
            setSelectedMessage(message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(e);
        }
    };

    return (
        <div className="chatbox">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div 
                        key={message.id || index} 
                        className={`message ${message.userId === currentUserId ? "right" : "left"} ${selectedMessage?.id === message.id ? "selected" : ""}`} 
                        onClick={() => handleSelectMessage(message)}
                    >
                        {message.replyToId && (
                            <div className="reply-info">
                                Replied to: {messages.find(m => m.id === message.replyToId)?.text}
                            </div>
                        )}
                        <div className="message-content">
                            {message.text}
                        </div>
                        <div className="timestamp">{new Date(message.timestamp).toLocaleString()}</div>
                    </div>
                ))}
                {loading && <div className="loading-indicator">Sending...</div>}
            </div>
            <div className="input-container">
                {selectedMessage && <div className="replying-to">Replying to: {selectedMessage.text}</div>}
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                />
                <button id="send" onClick={handleSendMessage}>
                    <span className="arrow-icon">➤</span> {/* Arrow icon */}
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
