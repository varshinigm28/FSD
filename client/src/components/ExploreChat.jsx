import React, { useState, useEffect } from 'react';
import Explore from './Explore';
import ChatBox from './ChatBox';
import '../index.css';

const ExploreChat = () => {
    const [messages, setMessages] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        fetchMessages(product._id);
    };

    const fetchMessages = async (productId) => {
        try {
            const response = await fetch(`http://localhost:7000/messages?productId=${productId}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            fetchMessages(selectedProduct._id);
        }
    }, [selectedProduct]);

    return (
        <div className="explore-chat-container">
            <div className={`explore-section ${selectedProduct ? 'slide-left' : ''}`}>
                <Explore onSelectProduct={handleSelectProduct} />
            </div>
            {selectedProduct && (
                <div className="chatbox-section">
                    <ChatBox selectedProduct={selectedProduct} messages={messages} />
                </div>
            )}
        </div>
    );
};

export default ExploreChat;
