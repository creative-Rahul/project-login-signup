const express = require("express")
const router = express.Router()
const NewStarUser = require("../models/registerSchema")
const bcrypt = require("bcrypt")
const multer = require("multer")
const upload = require("../middleware/upload")
const jwtAuth = require("../middleware/jwtAuth")
const {home , register, login, logout, forgotPassword, verifyOtp,updatePassword, changePassword} = require("../controllers/user/userRoutes")


router.get("/home",home)

router.post("/register",upload.any() ,register)
// router.post("/register",upload.single('imageOne') ,register)

router.post("/login", login)

router.get("/logout",logout)

router.post("/forgotPassword",forgotPassword)

router.post("/verifyOtp",verifyOtp)

router.post("/updatePassword",updatePassword)

router.post("/changePassword",changePassword)


router.post("/logout",jwtAuth,logout)




module.exports = router;