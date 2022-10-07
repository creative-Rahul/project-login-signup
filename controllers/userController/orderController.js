const Order = require("../../models/userModels/order");
const { error, success } = require("../../service_response/userApiResponse");

exports.newOrder = async (req, res) => {
    try {
        const { productId, quantity,  address, status } = req.body
        // console.log(req.body);
        // console.log(req.user._id);
        const order = new Order({
            userId: req.user._id,
            products: [{
                productId: productId,
                quantity: quantity,
            }],
            address: address,
            status: status
        });
        const ordered = await order.save()
        res.status(201).json(success(res.statusCode, "Order is placed", ordered))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while order", res.statusCode))
    }
}


exports.getOrder = async (req, res) => {
    try {
        const orderInfo = await Order.findOne({ userId: req.user._id }).populate("products.productId")
            .exec()
        res.status(201).json(success(res.statusCode, "Order Details", orderInfo))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in fetching order"))
    }
}

exports.updateOrder = async (req, res) => {
    try {
        const { status } = req.body
        const modifyOrder = await Order.findOne({ userId: req.user._id })
        modifyOrder.status = status
        await modifyOrder.save()
        res.status(201).json(success(res.statusCode, "Order has been Updated", modifyOrder))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while updating order", res.statusCode))
    }
}
