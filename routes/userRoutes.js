const express = require("express")
const router = express.Router()
const NewStarUser = require("../models/userModels/registerSchema")
const bcrypt = require("bcrypt")
const multer = require("multer")
const upload = require("../middleware/upload")
const userAuth = require("../middleware/jwtUserAuth")
const {home , register, login, logout, forgotPassword, verifyOtp,updatePassword, changePassword} = require("../controllers/userController/userAuth")

const{addProduct,updateProduct, allProducts,deleteProduct} = require("../controllers/adminController/productControl")

router.get("/home",home)

router.post("/register",upload.any() ,register)
// router.post("/register",upload.single('imageOne') ,register)

router.post("/login", login)

// router.get("/logout",logout)

router.post("/forgotPassword",forgotPassword)

router.post("/verifyOtp",verifyOtp)

router.post("/updatePassword",updatePassword)

router.post("/changePassword",changePassword)


router.post("/logout",userAuth,logout)

router.post("/addProduct",upload.any(),addProduct)

router.post("/updateProduct",updateProduct)

router.get("/allProducts",allProducts)

router.delete("/deleteProduct",deleteProduct)




module.exports = router;