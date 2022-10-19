const express = require("express");
const router = express.Router();
const { upload, createFilePath } = require("../middleware/upload");
const tokenAdminAuthorisation = require("../middleware/adminAuth");

const {
  CSVFileUpload,
  createImportFilePath,
} = require("../middleware/importUsers");

const {
  addProduct,
  updateProduct,
  allProducts,
  deleteProduct,
} = require("../controllers/adminController/productControl");

const {
  register,
  login,
  forgetPassword,
  verifyOtp,
  updatePassword,
  adminLogout,
  changePassword,
  getAdminData,
  getAllAdmin,
  editProfile,
} = require("../controllers/adminController/adminController");

const {
  getAllUsers,
  importUsers,
  adminAuthorisedUser,
  rejectUser,
  getUser,
  addUser,
  userStatus,
  editUserProfile,
  usersCount,
  allUsersList,
} = require("../controllers/adminController/userManagement");

const {
  editSlides,
  addAbout,
  editAbout,
  addTnC,
  editTnC,
  addPrivacyPolicy,
  editPrivacyPolicy,
  deleteSlide,
  addSlide,
  editSlide,
  getAllSlides,
} = require("../controllers/adminController/cmsController");

router.post("/register", createFilePath, upload.any(), register);

router.post("/login", login);

router.get("/getAdminData", tokenAdminAuthorisation, getAdminData);

router.get("/getAllAdmin", tokenAdminAuthorisation, getAllAdmin);

router.post("/forgetPassword", forgetPassword);

router.post("/verifyOtp", verifyOtp);

router.post("/updatePassword", updatePassword);

router.post("/changePassword", tokenAdminAuthorisation, changePassword);

router.post("/editProfile", tokenAdminAuthorisation, upload.any(), editProfile);

router.post("/allUsersList", tokenAdminAuthorisation, allUsersList);

router.get("/usersCount", tokenAdminAuthorisation, usersCount);

router.post("/getUser/:_id", tokenAdminAuthorisation, getUser);

router.post(
  "/addUser",
  createFilePath,
  upload.any(),
  tokenAdminAuthorisation,
  addUser
);

router.post("/userStatus/:_id", tokenAdminAuthorisation, userStatus);
router.post(
  "/adminAuthorisedUser/:_id",
  tokenAdminAuthorisation,
  adminAuthorisedUser
);

router.post("/rejectUser/:_id", tokenAdminAuthorisation, rejectUser);

router.post("/editUserProfile/:_id", upload.any(), editUserProfile);

router.post(
  "/importUsers",
  createImportFilePath,
  CSVFileUpload.any(),
  importUsers
);

router.post("/addProduct", tokenAdminAuthorisation, addProduct);

router.post("/updateProduct", tokenAdminAuthorisation, updateProduct);

router.delete("/deleteProduct", tokenAdminAuthorisation, deleteProduct);

router.get("/allProducts", allProducts);

// Content Management

router.post("/cms/addSlide", upload.any(), addSlide);

router.post("/cms/editSlide", upload.any(), editSlide);

router.get("/cms/getAllSlides", getAllSlides);

router.post("/cms/deleteSlide", deleteSlide);

router.post("/cms/addAbout", addAbout);

router.post("/cms/editAbout", editAbout);

router.post("/cms/addTnC", addTnC);

router.post("/cms/editTnC", editTnC);

router.post("/cms/addPrivacyPolicy", addPrivacyPolicy);

router.post("/cms/editPrivacyPolicy", editPrivacyPolicy);

module.exports = router;
