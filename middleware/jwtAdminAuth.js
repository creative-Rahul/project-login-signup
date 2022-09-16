const jwt = require("jsonwebtoken")
const NewStarAdmin = require("../models/adminModels/adminRegister")

const adminAuth = async (req,res,next)=>{
    try {
        const adminToken = req.cookies.jwt;
        const verifyAdmin = jwt.verify(adminToken,"thisismytokenforadmin")
        // console.log(verifyAdmin);
        const admin = await NewStarAdmin.findOne({_id:verifyAdmin._id})
        // console.log(admin);

        req.adminToken = adminToken;
        req.admin = admin;

        next()        
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = adminAuth;