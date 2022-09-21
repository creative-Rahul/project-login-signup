const mongoose = require("mongoose")

const cartSchema = mongoose.model({
    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "UnitProduct"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
}, { timestamps: true }, { collection: "Cart" })

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart;