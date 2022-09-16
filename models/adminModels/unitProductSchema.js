const mongoose = require("mongoose")

const unitProductSchema = mongoose.Schema({
    unitName:{
        type:String,
        required :true
    },
    weight:{
        type:Number,
        required:true
    },
    addedBy:{
        type:String,
        default : "Admin"
    },
    productImage:[{
        type:String,

    }]

})

const UnitProduct = mongoose.model("UnitProduct", unitProductSchema)

module.exports = UnitProduct;