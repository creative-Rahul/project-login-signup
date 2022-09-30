const express = require("express")
const router = express.Router()

const { upload, createFilePath } = require("../middleware/upload")
const {CSVFileUpload,createImportFilePath} = require("../middleware/importUsers")

const { addProduct, updateProduct, allProducts, deleteProduct } = require("../controllers/adminController/productControl")

const { register, login, forgetPassword, verifyOtp, updatePassword, adminLogout, changePassword, getAdminData, getAllAdmin, getAllUsers, importUsers, adminAuthorisedUser, rejectUser, getUser, editProfile, } = require("../controllers/adminController/adminController");

const tokenAdminAuthorisation = require("../middleware/adminAuth")


router.post("/register", createFilePath, upload.any(), register);

router.post("/login", login);

router.get("/getAdminData", tokenAdminAuthorisation, getAdminData)

router.get("/getAllAdmin", tokenAdminAuthorisation, getAllAdmin)

router.post("/forgetPassword", forgetPassword)

router.post("/verifyOtp", verifyOtp)

router.post("/updatePassword", updatePassword)

router.post("/changePassword", tokenAdminAuthorisation, changePassword)

router.post("/editProfile", tokenAdminAuthorisation, upload.any(), editProfile)

router.get("/getAllUsers", tokenAdminAuthorisation, getAllUsers)

router.post("/getUser/:_id", tokenAdminAuthorisation, getUser)

router.post("/adminAuthorisedUser/:_id", tokenAdminAuthorisation, adminAuthorisedUser)

router.post("/rejectUser/:_id", tokenAdminAuthorisation, rejectUser)

router.post("/importUsers",createImportFilePath, CSVFileUpload.any(), importUsers)

router.post("/addProduct", tokenAdminAuthorisation, addProduct)

router.post("/updateProduct", tokenAdminAuthorisation, updateProduct)

router.delete("/deleteProduct", tokenAdminAuthorisation, deleteProduct)

router.get("/allProducts", allProducts)



module.exports = router;