const jwt = require("jsonwebtoken")
const NewStarUser = require("../models/userModels/registerSchema")
const NewStarAdmin = require("../models/adminModels/adminRegister")

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "thisismyjsonwebtoken")
        // console.log(verifyUser);
        const user = await NewStarUser.findOne({ _id: verifyUser._id })
        // console.log(user);

        req.token = token;
        req.user = user;

        next()
    } catch (error) {
        res.status(401).send(error)
    }
}


const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyAdmin = jwt.verify(token, "thisismytokenforadmin")
        // console.log(verifyAdmin);
        const admin = await NewStarAdmin.findOne({ _id: verifyAdmin._id })
        // console.log(admin);

        req.token = token;
        req.admin = admin;

        next()
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = { userAuth, adminAuth };