
const { Order } = require('../model/order')
const Product = require('../model/Product');
const catchAsyncError = require("../middleware/catchAsynError.js");
const ErrorHandler = require("../utils/ErrorHandler.js.js");
// const Razorpay = require("razorpay")
const crypto = require("crypto");

exports.fetchOrdersByUser = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    try {
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.createOrder = async (req, res) => {
    const order = await Order(req.body)
    const productsId = order.items;
    productsId.forEach(async (e) => {
        const product = await Product.findById(e.product.id);
        product.stock = product.stock - e.quantity;
        await product.save();
    })
    try {
        await order.save()
        res.status(201).json(order)
    } catch (err) {
        res.status(400).json({ msg: "create order failed" })
    }
}



// const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_API_KEY,
//     key_secret: process.env.RAZORPAY_APT_SECRET,
// });


exports.checkout = async (req, res) => {
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });
};

exports.paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Database comes here
        console.log("success");


        // await Payment.create({
        //     razorpay_order_id,
        //     razorpay_payment_id,
        //     razorpay_signature,
        // });




        res.redirect(
            `http://localhost:3000/OderSuccessfull/${razorpay_payment_id}`
        );
    } else {
        console.log("error");
        res.status(400).json({
            success: false,
        });
    }
};