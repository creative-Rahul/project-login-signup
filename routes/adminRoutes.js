const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload")

const {addProduct, updateProduct, allProducts, deleteProduct} = require("../controllers/adminController/productControl")

const { register, login, forgetPassword, verifyOtp, updatePassword, adminLogout, changePassword, getAdminData, } = require("../controllers/adminController/adminAuth");

const tokenAdminAuthorisation = require("../middleware/adminAuth")


router.post("/register", upload.any(), register);

router.post("/login", login);

router.post("/getAdminData",tokenAdminAuthorisation,getAdminData)

router.post("/forgetPassword", forgetPassword)

router.post("/verifyOtp", verifyOtp)

router.post("/updatePassword", updatePassword)

router.post("/changePassword",tokenAdminAuthorisation, changePassword)

router.post("/adminLogout",  adminLogout)

router.post("/addProduct",tokenAdminAuthorisation,addProduct)

router.post("/updateProduct",tokenAdminAuthorisation,updateProduct)

router.delete("/deleteProduct",tokenAdminAuthorisation,deleteProduct)

router.get("/allProducts",allProducts)



module.exports = router;