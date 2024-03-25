const { Categories } = require("../model/categories");
exports.fetchAllCategories = async (req, res, next) => {
    const categories = await Categories.find()
    res.status(200).json({ success: true, msg: categories })
}
