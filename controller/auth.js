const crypto = require('crypto');
const { sanitizeUser } = require('../services/comman');
const jwt = require('jsonwebtoken');
const { sendmail } = require("../services/sendMail");
const { User } = require("../model/user");
const catchAsyncError = require("../middleware/catchAsynError.js");
const ErrorHandler = require("../utils/ErrorHandler.js.js");
const bcrypt = require('bcryptjs');

exports.register = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password ,phoneNo,name } = req.body;

        if (!email || !password) {
            throw new ErrorHandler('Please enter credentials', 400);
        }

        const user = await User.findOne({ email });

        if (user) {
            throw new ErrorHandler('User already exists', 400);
        }
        const newUser = await User.create({ email, password,phoneNo,name });
        const token = jwt.sign({ _id: newUser.id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user: newUser, token });
    } catch (error) {
        next(error);
    }
});

exports.login = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Check if the provided password matches the hashed password
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // If password is correct, generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });

        res.status(200).json({ success: true, user: user, token });
    } catch (error) {
        console.log(error);
        next(error);
    }
});


exports.jwt = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }


        const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user: user, token });
    } catch (error) {
        next(error);
    }
});
exports.allUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find({ role: { $ne: "admin" } }); 
    // console.log(users);
    res.status(200).json({ users })
});

exports.logout = async (req, res) => {
    try {
        res.clearCookie('jwt').sendStatus(200);
    } catch (error) {
        next(error);
    }
};

exports.checkUser = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
};

exports.resetPasswordRequest = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }

        const token = crypto.randomBytes(48).toString('hex');
        user.resetPasswordToken = token;
        await user.save();
        const resetPageLink = 'https://e-commerce-front-end-dun.vercel.app/reset-password?token=' + token + '&email=' + req.body.email;
        sendmail(req, res, next, resetPageLink);
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, password, token } = req.body;
        const user = await User.findOne({ email, resetPasswordToken: token });

        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }

        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) {
                throw new ErrorHandler('Error in hashing password', 500);
            }
            user.password = hashedPassword;
            user.salt = salt;
            await user.save();
            res.status(200).json({ success: true, msg: "Password reset successfully", user: user });
        });
    } catch (error) {
        next(error);
    }
};
