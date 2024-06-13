import { useEffect, useState } from 'react';
import '../index.css';
import axios from 'axios';

import { RiPencilLine } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import ChatBox from './ChatBox';

function Post() {
    const [file, setFile] = useState(null);
    const [details, setDetails] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [editingImage, setEditingImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [messages, setMessages] = useState([]);

    const userId = sessionStorage.getItem('userId');

    const handleUpload = (e) => {
        e.preventDefault();
        setError('');

        if (!file || !details || !price) {
            window.alert('Please fill all the required fields');
        } else if (price <= 0) {
            setError('Invalid price');
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);
            formData.append('details', details);
            formData.append('price', price);

            axios.post('http://localhost:7000/upload', formData)
                .then(res => {
                    console.log('Upload response:', res);
                    fetchImages();
                })
                .catch(err => console.log('Upload error:', err));
            setFile('');
            setDetails('');
            setPrice('');
        }
    };

    const fetchImages = () => {
        axios.get(`http://localhost:7000/getImage?userId=${userId}`)
            .then(res => {
                console.log('Fetch images response:', res.data);
                if (res.data && res.data.length > 0) {
                    setImages(res.data);
                } else {
                    console.log('No images found');
                }
            })
            .catch(err => console.log('Fetch images error:', err));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:7000/deleteImage/${id}`)
            .then(res => {
                console.log('Delete response:', res);
                fetchImages();
            })
            .catch(err => console.log('Delete error:', err));
    };

    const handleSaveEdit = () => {
        if (!details || !price) {
            window.alert('Please fill all the required fields');
            return;
        }
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('details', details);
        formData.append('price', price);
        if (file) formData.append('file', file);

        axios.put(`http://localhost:7000/editImage/${editingImage._id}`, formData)
            .then(res => {
                console.log('Edit response:', res);
                fetchImages();
                handleCancelEdit();
            })
            .catch(err => console.log('Edit error:', err));
    };

    const handleEdit = (image) => {
        setEditingImage(image);
        setFile(null);
        setDetails(image.details);
        setPrice(image.price);
    };

    const handleCancelEdit = () => {
        setEditingImage(null);
        setFile(null);
        setDetails('');
        setPrice('');
    };

    const handleImageClick = async (image) => {
        try {
            const response = await axios.get(`http://localhost:7000/messages?productId=${image._id}`);
            setMessages(response.data);
            setSelectedImage(image);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const closeModal = () => {
        setSelectedImage(null);
        setMessages([]);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="post_container">
            <div className='post-top-div'>
                <h1 className='pro'>Upload Your Post</h1>

                <form onSubmit={handleUpload} className='post-form'>
                    <div className="form-group">
                        <label className="post-label" htmlFor="productImage">Product Image:</label>
                        <input className='post-inputs' type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    <div className="det">
                        <label className="post-label" htmlFor="details">Details:</label>
                        <textarea
                            className='post-inputs details'
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="pri">
                        <label className="post-label" htmlFor="price">Price per 1kg:</label>
                        <input
                            type="number"
                            className='post-inputs price'
                            id="price"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button className='post-bt' type='submit'>Upload</button>
                </form>
            </div>

            <div className="post-images-container">
                {images.length > 0 ? (
                    images.map((img, index) => (
                        <div key={index} className="post-image-item">
                            <img
                                src={`http://localhost:7000/Images/${img.image}`}
                                alt={`Image ${index}`}
                                onClick={() => handleImageClick(img)}
                                onError={(e) => console.log('Image load error:', e)}
                            />
                            <p>Details: {img.details}</p>
                            <p>Price: {img.price}</p>
                            <div className="icons">
                                <button onClick={() => handleEdit(img)} className="edit-icon"><RiPencilLine size={30} /></button>
                                <button onClick={() => handleDelete(img._id)} className="delete-icon"><MdDelete size={27} /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No images available</p>
                )}
            </div>

            {editingImage && (
                <div className="edit-modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCancelEdit}>&times;</span>
                        <img
                            src={`http://localhost:7000/Images/${editingImage.image}`}
                            alt="Editing"
                            className="edit-image"
                        />
                        <div className="det">
                            <label className="post-label" htmlFor="editDetails">Details:</label>
                            <textarea
                                className='post-inputs details'
                                id="editDetails"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="pri">
                            <label className="post-label" htmlFor="editPrice">Price per 1kg:</label>
                            <input
                                type="number"
                                className='post-inputs price'
                                id="editPrice"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <button className='post-bt' onClick={handleSaveEdit}>Save</button>
                    </div>
                </div>
            )}

            {selectedImage && (
                <div className="chat-modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <img
                            src={`http://localhost:7000/Images/${selectedImage.image}`}
                            alt="Selected"
                            className="selected-image"
                        />
                        <ChatBox selectedProduct={selectedImage} messages={messages} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Post;
