const mongoose = require('mongoose')

exports.connectDB = async () => {
    try {
        mongoose.connect(process.env.DBURL)
        console.log("db connected");
    } catch (error) {
        console.log(error);
    }
}