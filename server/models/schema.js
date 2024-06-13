const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model("Signup_details", UserSchema);

const ProductSchema = new mongoose.Schema({
    userId: String,
    details: String,
    price: Number,
    image: String
});

const ProductModel = mongoose.model('Product_details', ProductSchema);


const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    details: String,
    price: Number,
    image: String
});

const CartModel = mongoose.model('Cart_details', CartSchema);

const messageSchema = new mongoose.Schema({
    text: String,
    messageType: String, // "reply" or "sent"
    userId: String,
    productId: String,
    replyToId: String,
    timestamp: Date // Use Date to store current date and time
});

const Message = mongoose.model('Message', messageSchema);


module.exports = {
    UserModel: UserModel,
    ProductModel: ProductModel,
    CartModel: CartModel,
    Message: Message
};
