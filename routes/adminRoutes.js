const express = require("express")
const router = express.Router()
const { adminAuth } = require("../middleware/jwtTokenAuth")
const upload = require("../middleware/upload")

const {addProduct, updateProduct, allProducts, deleteProduct} = require("../controllers/adminController/productControl")

const { register, login, forgetPassword, verifyOtp, updatePassword, adminLogout, changePassword, } = require("../controllers/adminController/adminAuth");

router.post("/register", upload.any(), register);

router.post("/login", login);

router.post("/forgetPassword", forgetPassword)

router.post("/verifyOtp", verifyOtp)

router.post("/updatePassword", updatePassword)

router.post("/changePassword", changePassword)

router.post("/adminLogout", adminAuth, adminLogout)

router.post("/addProduct",adminAuth,addProduct)

router.post("/updateProduct",adminAuth,updateProduct)

router.delete("/deleteProduct",adminAuth,deleteProduct)

router.get("/allProducts",allProducts)



module.exports = router;