const express = require("express")
const router = express.Router()
const {upload,createFilePath} = require("../middleware/upload")
const tokenAuthorisationUser = require("../middleware/userAuth")

const { home, register, login, logout, forgotPassword, verifyOtp, updatePassword, changePassword, contact, updateAddress, editProfile } = require("../controllers/userController/userController")
const { addToCart, updateCart, deleteCart, getCart } = require("../controllers/userController/cartController")
const { newOrder, getOrder, updateOrder } = require("../controllers/userController/orderController")

router.get("/home", home)

router.post("/register",createFilePath, upload.any(), register)

router.post("/login", login)

router.post("/forgotPassword", forgotPassword)

router.post("/verifyOtp", verifyOtp)

router.post("/updatePassword", updatePassword)

router.post("/changePassword", tokenAuthorisationUser, changePassword)

router.post("/updateAddress", tokenAuthorisationUser, updateAddress)

router.post("/editProfile",tokenAuthorisationUser,upload.any(),  editProfile)

// router.post("/logout", logout)

router.post("/contact", contact)

router.post("/cart/addToCart", tokenAuthorisationUser, addToCart)

router.post("/cart/updateCart", tokenAuthorisationUser, updateCart)

router.post("/cart/deleteCart/:_id", tokenAuthorisationUser, deleteCart)

router.get("/cart/getCart", tokenAuthorisationUser, getCart)

router.post("/order/newOrder",tokenAuthorisationUser,newOrder)

router.get("/order/getOrder",tokenAuthorisationUser,getOrder)

router.post("/order/updateOrder",tokenAuthorisationUser,updateOrder)


module.exports = router;