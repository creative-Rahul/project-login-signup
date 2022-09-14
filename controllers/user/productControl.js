const multer = require("multer")
const UnitProduct = require("../../models/adminModels/unitProductSchema")
const {success,error} = require("../../service_response/userApiResponse")

exports.addProduct = async(req,res)=>{
    try {
        const {unitName,weight,addedBy,productImage} = req.body
        console.log(files);
        const newProduct = new UnitProduct ({
            unitName:req.body.unitName,
            weight:req.body.weight,
            addedBy:req.body.addedBy,
            productImage:req.files.path
        })
        await newProduct.save()
        res.status(201).json(success(res.statusCode,"Product Added Successfully", newProduct))

    } catch (err) {
        console.log(err);
        res.status(401).json(error("Please enter valid Details of product". res.statusCode))
    }
}
