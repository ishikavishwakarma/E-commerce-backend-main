const { Order } = require("../model/order");

exports.getALLOderTOAdmin = async (req, res) => {
    
    let query = Order.find({});
    let totalOrdersQuery = Order.find({});
    const totalDocs = await totalOrdersQuery.count().exec();
    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }
    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    } catch (err) {
        res.status(400).json(err);
    }


};

exports.updateOrder = async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body);
    try {
        res.status(200).json(order)
    }
    catch (err) {
        res.status(400).json({ msg: "order update fails" })
    }
}

