const mongoose = require("mongoose")

const unitProductSchema = mongoose.Schema({
    unitName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    category: {
        type: Array
    },
    quantity: {
        type: Number,
        required: true
    },
    addedBy: {
        type: String,
        default: "Admin"
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true }, { collection: "UnitProduct" })

const UnitProduct = mongoose.model("UnitProduct", unitProductSchema)

module.exports = UnitProduct;