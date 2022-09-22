const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload")
const { home, register, login, logout, forgotPassword, verifyOtp, updatePassword, changePassword, contact, updateAddress } = require("../controllers/userController/userAuth")
const tokenAuthorisationUser = require("../middleware/userAuth")


router.get("/home", home)

router.post("/register", upload.any(), register)

router.post("/login", login)

router.post("/forgotPassword", forgotPassword)

router.post("/verifyOtp", verifyOtp)

router.post("/updatePassword", updatePassword)

router.post("/changePassword", tokenAuthorisationUser, changePassword)

router.post("/updateAddress", tokenAuthorisationUser, updateAddress)

router.post("/logout", logout)

router.post("/contact", contact)

// router.post("/addProduct",addProduct)

// router.post("/updateProduct",updateProduct)

// router.get("/allProducts",allProducts)

// router.delete("/deleteProduct",deleteProduct)




module.exports = router;