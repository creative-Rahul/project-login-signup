const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique:true
    },
    products: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "UnitProduct",
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
}, { timestamps: true }, { collection: "Cart" })

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart;