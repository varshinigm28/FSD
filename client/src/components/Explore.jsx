import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import ChatBox from './ChatBox';

function Explore({ onSelectProduct }) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showChatBox, setShowChatBox] = useState(false);

    const currentUserId = sessionStorage.getItem('userId');

    const fetchProducts = () => {
        axios.get(`http://localhost:7000/getAllImage`, {
            params: { userId: currentUserId }
        })
        .then(res => {
            console.log('Fetch products response:', res.data);
            if (res.data && res.data.length > 0) {
                setProducts(res.data);
            } else {
                console.log('No products found');
            }
        })
        .catch(err => {
            console.log('Fetch products error:', err);
            setError('Error fetching products');
        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        const cartData = {
            userId: currentUserId,
            productId: product._id,
            details: product.details,
            price: product.price,
            image: product.image
        };

        axios.post(`http://localhost:7000/addToCart`, cartData)
        .then(res => {
            alert('Item added to cart');
        })
        .catch(err => {
            if (err.response && err.response.status === 409) {
                alert('Item is already in the cart');
            } else {
                console.log('Add to cart error:', err);
            }
        });
    };

    const openModal = (product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const handleMessageIconClick = (product) => {
        setSelectedProduct(product);
        fetchMessages(product._id);
        setShowChatBox(true);
    };

    const fetchMessages = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:7000/messages`, {
                params: { productId }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const closeChatBox = () => {
        setShowChatBox(false);
        setSelectedProduct(null);
        setMessages([]);
    };

    return (
        <div className="explore-container">
            <h1 className='explore-title'>Explore Products</h1>
            <div className="explore-images-container">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div
                            key={product._id} // Use a unique key here
                            className="explore-image-item"
                            onClick={() => openModal(product)}
                        >
                            <img
                                src={`http://localhost:7000/Images/${product.image}`}
                                alt={`Image ${index}`}
                                onError={(e) => console.log('Image load error:', e)}
                            />
                            <p>Details: {product.details}</p>
                            <p>Price: {product.price} per 1kg</p>
                            <button className="add-to-cart-bt" onClick={() => addToCart(product)}>
                                Add to Cart
                            </button>
                            <button className="chat-icon" onClick={() => handleMessageIconClick(product)}>
                                <i className="fas fa-comments"></i>
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
                {showChatBox && selectedProduct && (
                    <div className="chatbox-overlay">
                        <div className="chatbox-wrapper">
                            <ChatBox
                                selectedProduct={selectedProduct}
                                messages={messages}
                                currentUserId={currentUserId}
                            />
                            <button className="close-chatbox" onClick={closeChatBox}>
                                X
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Explore;
