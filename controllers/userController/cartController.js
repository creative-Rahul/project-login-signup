const Cart = require("../../models/userModels/cart")
const { error, success } = require("../../service_response/userApiResponse")

exports.addToCart = async (req, res) => {
    try {
        const newCart = new Cart(req.body)
        const savedCart = await newCart.save()
        res.status(201).json(success(res.statusCode, "Product added to cart", savedCart))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while adding products ", res.statusCode))
    }
}


exports.updateCart = async (req, res) => {
    try {
        const modifyCart = await Cart.findByIdAndUpdate(req.user._id, {
            $set: req.body
        }, { new: true })
        res.status(201).json(res.statusCode, "Cart has been updated", modifyCart)
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while updating cart", res.statusCode))
    }
}



exports.deleteCart = async (req, res) => {
    try {
        const modifyCart = await Cart.findByIdAndDelete(req.user._id)
        res.status(201).json(success(res.statusCode, "Cart has been deleted", modifyCart))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while updating cart", res.statusCode))
    }
}


exports.getCart = async (req, res) => {
    try {
        const getUserCart = await Cart.findOne({ userId: req.params.userId })
        // console.log(getUserCart);   
        res.status(201).json(success(res.statusCode, "Your Cart is here", getUserCart))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in fetching Cart", res.statusCode))
    }
}