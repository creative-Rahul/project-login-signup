const Order = require("../../models/userModels/order");
const { error } = require("../../service_response/userApiResponse");

exports.newOrder = async (req,res)=>{
    try {
        const order = new  Order(req.body);
        const ordered = await order.save()
        res.status()
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while order",res.statusCode))
    }
}