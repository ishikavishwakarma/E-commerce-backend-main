const { Brand } = require("../model/brands");

exports.fetchAllBrand = async (req, res, next) => {
    try {
        const brands = await Brand.find();
        if (!brands || brands.length === 0) {
            return res.status(404).json({ success: false, msg: "No brands found" });
        }
        res.status(200).json({ success: true, msg: brands });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
