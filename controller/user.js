const { User } = require("../model/user");
const catchAsyncError = require("../middleware/catchAsynError.js");
const ErrorHandler = require("../utils/ErrorHandler.js.js");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


exports.updateProfile = catchAsyncError(async (req, res) => {
    const { _id: id } = req.user;
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== id) {
            throw new ErrorHandler("Email ID already in use", 400);
        }

        const user = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });

        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});


exports.getUserById = catchAsyncError(async (req, res) => {
    const Id = req.params.id;
    try {
        const user = await User.findById(Id);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});

exports.updateUserAddress = catchAsyncError(async (req, res) => {
    const { _id: id } = req.user;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});

exports.removeAddress = catchAsyncError(async (req, res) => {
    const { _id: id } = req.user;
    try {
        const user = await User.findByIdAndUpdate(id, { addresses: req.body.addresses });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});

exports.uploadImage = catchAsyncError(async (req, res) => {
    const { _id: id } = req.user;
    const file = req.file.path;
    try {
        const user = await User.findByIdAndUpdate(id, { image: file },{ new: true });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});
