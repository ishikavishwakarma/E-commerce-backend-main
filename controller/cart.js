const { Cart } = require("../model/cart");
const catchAsyncError = require("../middleware/catchAsynError.js");
const ErrorHandler = require("../utils/ErrorHandler.js.js");


exports.fetchCartByUser = catchAsyncError(async (req, res, next) => {
    const { _id: id } = req.user;
    try {
        const cartItems = await Cart.find({ user: id }).populate('user').populate('product');
        res.status(200).json(cartItems);
    } catch (err) {
        next(err)
    }
});

exports.addTOCart = catchAsyncError(async (req, res, next) => {
    try {
        const cart = await Cart.create({ ...req.body, quantity: parseInt(req.body.quantity) });
        const doc = await cart.save();
        res.status(201).json(doc);
    } catch (err) {
        next(err)
    }
});

exports.deleteCart = catchAsyncError(async (req, res, next) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        res.status(201).json(cart);
    } catch (err) {
        next(err)
    }
});

exports.updateCart = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(id, { ...req.body });
        const doc = await cart.save();
        const carts = await Cart.find().populate('user').populate('product');
        res.status(201).json(carts);
    } catch (err) {
        next(err)
    }
});

exports.deleteAllCart = catchAsyncError(async (req, res, next) => {
    // const cart = await Cart.deleteMany({ user: req.params.id })
    // try {
    //     res.status(201).json(cart)
    // } catch (err) {
    //     res.status(400).json(err)
    // }
});
