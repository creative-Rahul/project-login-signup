const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        enum: ["CONFIRMED", "PENDING", "CANCELED", "COUNTER", "COMPLETED"],
        default: "PENDING"
    }
}, { timestamps: true })


const Order = mongoose.model("Order",orderSchema)

module.exports = Order;