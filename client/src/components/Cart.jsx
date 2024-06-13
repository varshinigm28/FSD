import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);  // State for the quantity input
  const currentUserId = sessionStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:7000/getCartItems?userId=${currentUserId}`)
      .then(res => {
        setCartItems(res.data);
      })
      .catch(err => {
        console.log('Fetch cart items error:', err);
      });
  }, [currentUserId]);

  const handleDelete = (itemId) => {
    axios.delete(`http://localhost:7000/deleteCartItem/${itemId}`)
      .then(() => {
        setCartItems(cartItems.filter(item => item._id !== itemId));
      })
      .catch(err => {
        console.log('Delete cart item error:', err);
      });
  };

  const handleExpand = (item) => {
    setExpandedItem(item);
  };

  const handleCloseModal = () => {
    setExpandedItem(null);
    setQuantity(1);  // Reset quantity to 1 when closing the modal
  };
  const handlepay = () => {
    window.alert('Payment completed successful')
  }
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-items-container">
        {cartItems.map(item => (
          <div key={item._id} className="cart-item">
            <img src={`http://localhost:7000/Images/${item.image}`} alt={item.details} />
            <p>details: {item.details}</p>
            <p>Price: {item.price}</p>
            <div className="icons">

            <button className="pay-now-icon" onClick={() => handleExpand(item)}>Pay Now</button>
              <button className="cart-delete-icon" onClick={() => handleDelete(item._id)}><MdDelete size={27} /></button>
             
            </div>
          </div>
        ))}
      </div>

      {expandedItem && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <img src={`http://localhost:7000/Images/${expandedItem.image}`} alt={expandedItem.details} />
            <p>details: {expandedItem.details}</p>
            <p>Price: {expandedItem.price}</p>
            <div className="payment-options">
              <label>Select Payment Mode:</label>
              <select>
                <option value="Cash-on-Delivery">Cash on Delivery</option>
                <option value="credit-card">Credit Card</option>
                <option value="debit-card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="Google-Pay">Google Pay</option>
                <option value="Phone-Pay">Phone Pay</option>
              </select>
            </div>
            <div className="quantity-input">
              <label>Enter quantity (in kgs):</label>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
              />
            </div>
            <button className="checkout-button" onClick={handlepay}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
