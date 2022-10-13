const validator = require("validator");
const { success, error } = require("../../service_response/userApiResponse");
const NewStarAdmin = require("../../models/adminModels/adminRegister");

// Register Admin to StarImporters
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, adminRole, password, isAdmin } =
      req.body;
    // console.log(req.files);
    if (!firstName) {
      return res
        .status(201)
        .json(error("Please enter valid name", res.statusCode));
    }
    if (!lastName) {
      return res
        .status(201)
        .json(error("Please enter valid name", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please enter valid email", res.statusCode));
    }
    if (!adminRole) {
      return res
        .status(201)
        .json(error("Please enter Admin Role", res.statusCode));
    }
    if (!password) {
      return res
        .status(201)
        .json(error("Please enter Password", res.statusCode));
    }
    if (!req.files.length) {
      return res.status(201).json(error("Please provide profile picture"));
    }
    const verifyEmail = await NewStarAdmin.findOne({ email: email });
    if (verifyEmail) {
      return res
        .status(201)
        .json(error("Email is already Registered", res.statusCode));
    }
    const newAdminUser = new NewStarAdmin({
      firstName: firstName,
      lastName: lastName,
      email: email,
      adminProfile: `${req.files[0].destination.replace(
        "./public/images",
        ""
      )}/${req.files[0].filename}`,
      // adminProfile:req.files[0].path,
      password: password,
    });
    // const token = await newAdminUser.generateAdminAuthToken()
    const registered = await newAdminUser.save();
    res
      .status(201)
      .json(
        success(res.statusCode, "Admin has registered Successfully", registered)
      );
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while registration", res.statusCode));
  }
};

// User login to Admin Importers
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please enter valid Email", res.statusCode));
    }
    if (!password) {
      return res.status(201).json(error("Please enter Password"));
    }
    const verifyAdmin = await NewStarAdmin.findOne({ email: email });
    if (!verifyAdmin) {
      return res
        .status(201)
        .json(error("Email is not Registered", res.statusCode));
    }
    const token = await verifyAdmin.generateAdminAuthToken();

    if (
      !(await verifyAdmin.checkAdminPassword(password, verifyAdmin.password))
    ) {
      return res.status(201).json(error("Wrong Password", res.statusCode));
    }
    // res.cookie("jwt", token, {
    //     expires: new Date(Date.now() + 10 * 60000)
    // })
    res
      .header("x-auth-token-admin", token)
      .header("access-control-expose-headers", "x-auth-token-admin")
      .status(201)
      .json(success(res.statusCode, "Logged in", { verifyAdmin, token }));
  } catch (err) {
    console.log(err);
    res
      .status(201)
      .json(error("Please enter valid Credential", res.statusCode));
  }
};

// Forget password -> Admin
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please enter a valid mail", res.statusCode));
    }
    const updateAdminPassword = await NewStarAdmin.findOne({ email: email });
    if (!updateAdminPassword) {
      return res.status(201).json(error("User not registered", res.statusCode));
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    await NewStarAdmin.findOneAndUpdate({ email: email }, { otp: otp });
    res.status(201).json(success(res.statusCode, "Otp Sent", { otp }));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Wrong Credentials"));
  }
};

// Verify OTP -> Admin
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please enter valid mail", res.statusCode));
    }
    if (!otp) {
      return res.status(201).json(error("Please enter OTP", res.statusCode));
    }
    const verifyAdminOtp = await NewStarAdmin.findOne({ email });
    if (!verifyAdminOtp) {
      return res.status(201).json(error("User not registered", res.statusCode));
    }
    if (verifyAdminOtp.otp !== otp) {
      return res.status(201).json("Invalid OTP", res.statusCode);
    }
    await NewStarAdmin.findOneAndUpdate({ email: email }, { otp: "" });
    res.status(201).json(success(res.statusCode, "OTP Verified", {}));
  } catch (err) {
    console.log(err);
    res
      .status(201)
      .json("Something went wrong while verification", res.statusCode);
  }
};

// Update password -> Admin
exports.updatePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const password = req.body.newPassword;
    if (!validator.isEmail(email)) {
      return res.status(201).json(error("Email is Invalid", res.statusCode));
    }
    const updateAdminPassword = await NewStarAdmin.findOne({
      email: email,
    }).select("password");
    if (!updateAdminPassword) {
      return res
        .status(201)
        .json(error("Please enter password", res.statusCode));
    }
    updateAdminPassword.password = password;
    await updateAdminPassword.save();
    res
      .status(201)
      .json(
        success(
          res.statusCode,
          "Password Updated Sucessfully",
          updateAdminPassword
        )
      );
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(
        error("Something went wrong in password Updation", res.statusCode, err)
      );
  }
};

// Change Password after login -> Admin
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await NewStarAdmin.findById(req.admin._id).select("password");

    if (!(await admin.checkAdminPassword(oldPassword, admin.password))) {
      return res
        .status(201)
        .json(error("Old Password not matched", res.statusCode));
    }
    admin.password = newPassword;
    await admin.save();
    res
      .status(201)
      .json(
        success(res.statusCode, "Password Updated Successfully", { admin })
      );
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(error("Error while changing Password", res.statusCode));
  }
};

// Edit profile -> admin
exports.editProfile = async (req, res) => {
  try {
    // console.log(req.files);
    const { firstName, lastName } = req.body;
    // console.log(req.body);
    const admin = await NewStarAdmin.findById(req.admin._id);
    if (firstName) {
      admin.firstName = firstName;
    }
    if (lastName) {
      admin.lastName = lastName;
    }
    if (req.files.length) {
      admin.adminProfile = `${req.files[0].destination.replace(
        "/public/images"
      )}/${req.files[0].filename}`;
    }
    await admin.save();
    res
      .status(201)
      .json(success(res.statusCode, "Profile updated Successfully", { admin }));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while profile updation"));
  }
};

// View admin profile
exports.getAdminData = async (req, res) => {
  try {
    const admin = await NewStarAdmin.findById(req.admin._id).select(
      "-password"
    );
    res
      .status(201)
      .json(
        success(res.statusCode, "Admin Data fetched Successfully", { admin })
      );
  } catch (err) {
    console.log(err);
    res.status(401).json("Error while fetching admin data", res.statusCode);
  }
};

// View all admins Profile
exports.getAllAdmin = async (req, res) => {
  try {
    const admin = await NewStarAdmin.find().select("-password");
    res
      .status(201)
      .json(
        success(res.statusCode, "Admin Data fetched Successfully", { admin })
      );
  } catch (err) {
    console.log(err);
    res.status(401).json("Error while fetching admin data", res.statusCode);
  }
};
