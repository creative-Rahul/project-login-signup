const UnitProduct = require("../../models/adminModels/unitProduct")
const { success, error } = require("../../service_response/userApiResponse")

exports.addProduct = async (req, res) => {
    const { unitName, category, subCategory,flavour, price, description, quantity,brand } = req.body
    try {
        if (!unitName || !category || !price) {
            return res.status(201).json(error("Please enter all details", res.statusCode))
        }
        // console.log(req.files);
        // console.log(req.files.length);
        const isAdded = await UnitProduct.findOne({ unitName })
        if (isAdded) {
            return res.status(201).json(error("Product is already Registered", res.statusCode))
        }
        const newProduct = new UnitProduct({
            unitName: unitName,
            description: description,
            category: category,
            subCategory: subCategory,
            flavour:flavour,
            quantity: quantity,
            price: price,
            brand:brand
            // productImage: [req.files[0]?.path, req.files[1]?.path, req.files[2]?.path],
            // productImage: [images],
            // productImage:req.files.forEach(element => {
            //     return element.path
            //     console.log(element.path);
            // })
        })
        await newProduct.save()
        res.status(201).json(success(res.statusCode, "Product Added Successfully", newProduct))
        // console.log(newProduct);
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Please enter valid Details of product",res.statusCode))
    }
}


exports.updateProduct = async (req, res) => {
    const { unitName, category, addedBy, price } = req.body;
    // console.log(req.body);
    try {
        if (!unitName) {
            return res.status(201).json(error("Product not exist", res.statusCode))
        }
        // const modifyProduct = await UnitProduct.findOne({ unitName })
        const updated = await UnitProduct.findOneAndUpdate(
            { unitName: unitName },
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        res.status(201).json(success(res.statusCode, "Successfully Updated", updated))

    } catch (err) {
        console.log(err);
        res.status(201).json(error("Trouble in updating please provide right credential", res.statusCode))
    }
}


exports.allProducts = async (req, res) => {
    try {
        const products = await UnitProduct.find()
        // console.log(products);
        res.status(201).json(success(res.statusCode, "All Product", products))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in finding Document", res.statusCode))
    }
}


exports.deleteProduct = async (req, res) => {
    const { unitName } = req.body
    try {
        if (!unitName) {
            return res.status(201).json(error("Please Provide Name of the product", res.statusCode))
        }
        await UnitProduct.findOneAndDelete({ unitName: unitName })
        res.status(201).json(success(res.statusCode, "Deletion Successfull", UnitProduct))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in Deletion", res.statusCode))
    }
}