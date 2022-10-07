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
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    flavour: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand:{
        type:String,
        required:true
    }
}, { timestamps: true }, { collection: "UnitProduct" })

const UnitProduct = mongoose.model("UnitProduct", unitProductSchema)

module.exports = UnitProduct;