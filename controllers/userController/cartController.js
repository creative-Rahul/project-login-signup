const Cart = require("../../models/userModels/cart")
const UnitProducts = require("../../models/adminModels/unitProduct")
const { error, success } = require("../../service_response/userApiResponse")

exports.getProducts = async(req,res)=>{
    try {
        const {sortBy} = req.body
        const allProducts = await UnitProducts.aggregate([
            
        ])
    } catch (err) {
        console.log(err);
        res.status(201).json(error("Error while fetching products",res.statusCode))
    }
}

exports.addToCart = async (req, res) => {
    try {
        // console.log(req.user._id);
        const { productId, quantity } = req.body
        const newCart = new Cart({
            userId: req.user._id,
            products: [{
                productId: productId,
                quantity: quantity
            }]
        })
        // console.log(newCart);
        const savedCart = await newCart.save()
        res.status(201).json(success(res.statusCode, "Product added to cart", savedCart))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while adding products ", res.statusCode))
    }
}


exports.updateCart = async (req, res) => {
    try {
        // console.log(req.user._id);
        const { productId, quantity } = req.body
        // console.log(req.body);
        const modifyCart = await Cart.findOneAndUpdate({ userId: req.user._id }, {
            $push: { products: { productId: productId, quantity: quantity } }
        }, { new: true })
        // console.log(modifyCart);
        res.status(201).json(success(res.statusCode, "Cart has been updated", modifyCart))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while updating cart", res.statusCode))
    }
}


exports.deleteCart = async (req, res) => {
    try {
        const modifyCart = await Cart.findByIdAndDelete(req.params._id)
        res.status(201).json(success(res.statusCode, "Cart has been deleted", modifyCart))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while updating cart", res.statusCode))
    }
}




exports.getCart = async (req, res) => {
    try {
        // console.log(req.user._id);
        const getUserCart = await Cart.findOne({ userId: req.user._id }).populate("products.productId")
            .exec()
        // console.log(getUserCart);
        // console.log(getUserCart.products[0].productId.price);
        res.status(201).json(success(res.statusCode, "Your Cart is here", getUserCart))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in fetching Cart", res.statusCode))
    }
}



// db.carts.aggregate([{ $lookup: { localField: "products.productId", foreignField: "_id", from: "unitproducts", as: "products" } }, { $unwind: "$products" }]).pretty()

// db.carts.aggregate([{ $lookup: { localField: "products.productId", foreignField: "_id", from: "unitproducts", as: "products" } },{$unwind:"$products"},{$project:{price:1}}]).pretty()