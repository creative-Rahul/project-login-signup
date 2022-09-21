const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload")
const { userAuth } = require("../middleware/jwtTokenAuth")
const { home, register, login, logout, forgotPassword, verifyOtp, updatePassword, changePassword, contact } = require("../controllers/userController/userAuth")


router.get("/home", home)

router.post("/register", upload.any(), register)

router.post("/login", login)

router.post("/forgotPassword", forgotPassword)

router.post("/verifyOtp", verifyOtp)

router.post("/updatePassword", updatePassword)

router.post("/changePassword", userAuth, changePassword)


router.post("/logout", userAuth, logout)

router.post("/contact", contact)

// router.post("/addProduct",addProduct)

// router.post("/updateProduct",updateProduct)

// router.get("/allProducts",allProducts)

// router.delete("/deleteProduct",deleteProduct)




module.exports = router;