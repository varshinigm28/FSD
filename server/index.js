const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const { UserModel, ProductModel, CartModel,Message } = require('./models/schema'); // Assuming your models file is in the same directory and named 'models.js'

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

async function connectdb() {
  try {
    await mongoose.connect("mongodb://localhost:27017/farmerWorld");
    console.log("DB connection success");
    const x = 7000;
    app.listen(x, function() {
      console.log(`Starting port ${x}...`);
    });
  } catch (err) {
    console.log("DB not connected: " + err);
  }
}
connectdb();

// Login
app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await UserModel.findOne({ name });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ id: user._id, name: user.name, email: user.email });
    } else {
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      if (existingUser.email === email) {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(400).json({ message: 'Username already exists' });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User created successfully', userId: user._id });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const { userId, details, price } = req.body;
  ProductModel.create({ userId, details, price, image: req.file.filename })
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

app.get('/getImage', (req, res) => {
  const userId = req.query.userId;
  ProductModel.find({ userId })
    .then(products => res.json(products))
    .catch(err => console.log(err));
});

app.get('/getAllImage', (req, res) => {
  const currentUserId = req.query.userId;
  if (!currentUserId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  ProductModel.find({ userId: { $ne: currentUserId } })
    .then(products => res.json(products))
    .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

// Get user profile
app.get('/user', async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
app.put('/user', async (req, res) => {
  const { userId, name, email } = req.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/getCartItems', (req, res) => {
  const currentUserId = req.query.userId;
  CartModel.find({ userId: currentUserId })
    .then(items => res.json(items))
    .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

// Add to cart
app.post('/addToCart', async (req, res) => {
  const { userId, productId, details, price, image } = req.body;

  console.log('Received addToCart request:', req.body);

  if (!userId || !productId || !details || !price || !image) {
    console.log('Missing required fields:', { userId, productId, details, price, image });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the item already exists in the cart
    const existingItem = await CartModel.findOne({ userId, productId });

    if (existingItem) {
      // If the item exists in the cart, send a message indicating it's already there
      return res.status(409).json({ message: 'Item is already in the cart' });
    }

    // If the item doesn't exist in the cart, add it
    const newItem = await CartModel.create({ userId, productId, details, price, image });
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Internal Server Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/deleteImage/:id', async (req, res) => {
  try {
      const imageId = req.params.id;
      const result = await ProductModel.findByIdAndDelete(imageId);
      if (!result) {
          return res.status(404).json({ error: 'Image not found' });
      }
      res.status(200).json(result);
  } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Error deleting image' });
  }
});

// Edit image
app.put('/editImage/:id', upload.single('file'), async (req, res) => {
  try {
      const imageId = req.params.id;
      const updateData = {
          details: req.body.details,
          price: req.body.price,
      };
      if (req.file) {
          updateData.image = req.file.filename; // Ensure this is correctly referencing the uploaded file
      }
      const result = await ProductModel.findByIdAndUpdate(imageId, updateData, { new: true });
      if (!result) {
          return res.status(404).json({ error: 'Image not found' });
      }
      res.status(200).json(result);
  } catch (error) {
      console.error('Error editing image:', error);
      res.status(500).json({ error: 'Error editing image' });
  }
});


// Delete Cart Item
app.delete('/deleteCartItem/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await CartModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/payCartItem/:id', async (req, res) => {
  const { id } = req.params;
  const { paymentMethod } = req.body;
  try {
    // Assuming payment processing logic is handled here
    const cartItem = await CartModel.findById(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    // Placeholder for actual payment processing
    // On successful payment:
    await CartModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Payment successful and item deleted from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//messsage
app.post('/message', async (req, res) => {
  const { text, messageType, userId, productId, replyToId } = req.body;
  const newMessage = new Message({
      text,
      messageType,
      userId,
      productId,
      replyToId,
      timestamp: new Date() // Set the current date and time
  });

  try {
      await newMessage.save();
      res.status(200).send({ message: 'Message saved!' });
  } catch (error) {
      res.status(500).send({ error: 'Failed to save message' });
  }
});

app.get('/messages', async (req, res) => {
  const { productId } = req.query; // Fetch messages for the specific product
  try {
      const messages = await Message.find({ productId });
      res.status(200).send(messages);
  } catch (error) {
      res.status(500).send({ error: "Failed to fetch messages" });
  }
});

