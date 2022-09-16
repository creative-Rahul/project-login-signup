const express = require("express")
const router = express.Router()
const adminAuth = require("../middleware/jwtAdminAuth")
const upload = require("../middleware/upload")


const {register, login, forgetPassword, verifyOtp, updatePassword, adminLogout, changePassword,} = require("../controllers/adminController/adminAuth");

router.post("/register",upload.any(),register);

router.post("/login",login);

router.post("/forgetPassword",forgetPassword)

router.post("/verifyOtp",verifyOtp)

router.post("/updatePassword",updatePassword)

router.post("/changePassword",adminAuth,changePassword)

router.post("/adminLogout",adminAuth,adminLogout)



module.exports = router;