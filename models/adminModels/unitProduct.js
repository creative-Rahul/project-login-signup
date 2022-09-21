const mongoose = require("mongoose")

const unitProductSchema = mongoose.Schema({
    unitName: {
        type: String,
        required: true
    },
    category: {
        type:Array
    },
    addedBy: {
        type: String,
        default: "Admin"
    },
    price:{
        type:Number,
        required:true
    }
},{timestamps:true})

const UnitProduct = mongoose.model("UnitProduct", unitProductSchema)

module.exports = UnitProduct;