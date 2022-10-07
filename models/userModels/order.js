const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "UnitProduct"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
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


const Order = mongoose.model("Order", orderSchema)

module.exports = Order;