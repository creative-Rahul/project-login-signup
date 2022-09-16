const multer = require("multer")
const UnitProduct = require("../../models/adminModels/unitProductSchema")
const { success, error } = require("../../service_response/userApiResponse")

exports.addProduct = async (req, res) => {
    const { unitName, weight, addedBy } = req.body
    try {
        if (!unitName || !weight || !addedBy) {
            res.status(201).json(error("Please enter all details", res.statusCode))
        }
        // console.log(req.files);
        // console.log(req.files.length);
        // let location
        // for (let i = 0; i < req.files.length; i++) {
        //     location = req.files[i].path
        // }
        // console.log(location);
        // let images = req.files.forEach(function(element){
        //     return element.path
        //     console.log(element.path);
        // });
        // console.log(images);
        else {
            const newProduct = new UnitProduct({
                unitName: req.body.unitName,
                weight: req.body.weight,
                addedBy: req.body.addedBy,
                productImage: [req.files[0]?.path, req.files[1]?.path, req.files[2]?.path],
                // productImage: [images],
                // productImage:req.files.forEach(element => {
                //     return element.path
                //     console.log(element.path);
                // })
            })
            await newProduct.save()
            res.status(201).json(success(res.statusCode, "Product Added Successfully", newProduct))
        }

    } catch (err) {
        console.log(err);
        res.status(401).json(error("Please enter valid Details of product".res.statusCode))
    }
}


exports.updateProduct = async (req, res) => {
    const { unitName, weight, addedBy } = req.body;
    console.log(req.body);
    try {
        const modifyProduct = await UnitProduct.findOne({ unitName })
        if (!unitName || !weight || !addedBy) {
            res.status(201).json
        }
        else if (!unitName) {
            res.status(201).json(error("Product not exist", res.statusCode))
        }
        else {
            const updated = await UnitProduct.findOneAndUpdate({ unitName: unitName },
                {
                    $set: {
                        weight: weight,
                        addedBy: addedBy
                    }
                },
                {
                    new:true
                })

            res.status(201).json(success(res.statusCode, "Successfully Updated", updated))
        }
    } catch (err) {
        console.log(err);
        res.status(201).json(error("Trouble in updating please provide right credential"))
    }
}


exports.allProducts = async(req,res)=>{
    try {
        const products = await UnitProduct.find()
        // console.log(products);
        res.status(201).json(success(res.statusCode,"All Product",products))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in finding Document",res.statusCode))
    }
}


exports.deleteProduct = async (req,res)=>{
    const {unitName} = req.body
    try {
        if(!unitName){
            res.status(201).json(error("Please Provide Name of the product",res.statusCode))
        }
        else{
            await UnitProduct.findOneAndDelete({unitName:unitName})
            res.status(201).json(success(res.statusCode,"Deletion Successfull",UnitProduct))
        }
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in Deletion", res.statusCode))
    }
}