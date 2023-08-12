const validator = require("validator");
const NewStarUser = require("../../models/userModels/userRegister");
const Contact = require("../../models/contact");
const { success, error } = require("../../service_response/userApiResponse");


exports.contact = async (req, res) => {
  const { fullName, email, subject, messageTextArea } = req.body;
  if (!validator.isEmail(email)) {
    return res
      .status(201)
      .json(error("Please enter valid Email", res.statusCode));
  }
  try {
    const newContact = new Contact({
      fullName: fullName,
      email: email,
      subject: subject,
      messageTextArea: messageTextArea,
    });
    const newMessage = await newContact.save();
    res
      .status(201)
      .json(success(res.statusCode, "We'll contact you ASAP", newMessage));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Please enter valid details", res.statusCode));
  }
};

exports.home = (req, res) => {
  res.send("Welcome to home page");
};

exports.register = async (req, res) => {
  try {
    // console.log(req.body.email);
    // console.log(req.files)
    // console.log(req.files[1])
    // console.log(req.file[1])
    const {
      companyName,
      dba,
      addressLine,
      city,
      state,
      zipcode,
      firstName,
      lastName,
      email,
      phoneNumber,
      quotation,
      heardAboutUs,
    } = req.body;

    if (!validator.isAlpha(firstName)) {
      return res
        .status(201)
        .json(error("Please enter valid name", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("please enter valid email", res.statusCode));
    }
    if (!email) {
      return res.status(201).json("Please provide email", res.statusCode);
    }
    const verifyEmail = await NewStarUser.findOne({ email: email });
    if (verifyEmail) {
      return res
        .status(201)
        .json(error("Email is already registered", res.statusCode));
    }

    const federalTaxId = req.files[0].path;
    const businessLicense = req.files[1].path;
    const salesTaxId = req.files[2].path;
    const accountOwnerId = req.files[3].path;
    const tobaccoLicence = req.files[4].path;
    if (!federalTaxId) {
      return res
        .status(200)
        .json(error("Please upload federal Tax Id", res.statusCode));
    }
    if (!businessLicense) {
      return res
        .status(200)
        .json(error("Please upload business License", res.statusCode));
    }
    if (!salesTaxId) {
      return res
        .status(200)
        .json(error("Please upload sales Tax Id", res.statusCode));
    }
    if (!accountOwnerId) {
      return res
        .status(200)
        .json(error("Please upload account Owner Id", res.statusCode));
    }

    const password = Math.floor(10000 + Math.random() * 90000);

    const newuser = new NewStarUser({
      companyName: companyName,
      dba: dba,
      addressLine: addressLine,
      city: city,
      state: state,
      zipcode: zipcode,
      // federalTaxId: federalTaxId,
      // businessLicense: businessLicense,
      // salesTaxId: salesTaxId,
      // tobaccoLicence: tobaccoLicence,
      // accountOwnerId: accountOwnerId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      quotation: quotation,
      heardAboutUs: heardAboutUs,
    });
    for (let i = 0; i < req.files.length; i++) {
      if (req.files[i].fieldname == "federalTaxId") {
        newuser.federalTaxId = req.files[i].path;
      }
      if (req.files[i].fieldname == "businessLicense") {
        newuser.businessLicense = req.files[i].path;
      }
      if (req.files[i].fieldname == "salesTaxId") {
        newuser.salesTaxId = req.files[i].path;
      }
      if (req.files[i].fieldname == "accountOwnerId") {
        newuser.accountOwnerId = req.files[i].path;
      }
      if (req.files[i].fieldname == "tobaccoLicence") {
        newuser.tobaccoLicence = req.files[i].path;
      }
    }
    if (!newuser.federalTaxId) {
      return res
        .status(200)
        .json(error("Please upload federal Tax Id", res.statusCode));
    }
    if (!newuser.businessLicense) {
      return res
        .status(200)
        .json(error("Please upload business License", res.statusCode));
    }
    if (!newuser.salesTaxId) {
      return res
        .status(200)
        .json(error("Please upload sales Tax Id", res.statusCode));
    }
    if (!newuser.accountOwnerId) {
      return res
        .status(200)
        .json(error("Please upload account Owner Id", res.statusCode));
    }
    // console.log(newuser);
    const registerd = await newuser.save();
    // console.log("User's password -> " + password);
    res.status(201).json(
      success(res.statusCode, "Registered Successfully", {
        registerd,
        password,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Wrong input", res.statusCode));
  }
};

exports.login = async (req, res) => {
  try {
    // console.log(req.body);
    const email = req.body.email;
    const plainPassword = req.body.password;
    const password = plainPassword.toString();

    const verifyUser = await NewStarUser.findOne({ email: email });

    if (!verifyUser) {
      return res
        .status(201)
        .json(error("Email is not registered", res.statusCode));
    }

    if (!(await verifyUser.correctPassword(password, verifyUser.password))) {
      return res.status(201).json(error("Wrong Password", res.statusCode));
    }

    if (verifyUser.isVerified == "PENDING") {
      return res
        .status(201)
        .json(error("You are not authorised by admin", res.statusCode));
    }

    if (!verifyUser.status) {
      return res
        .status(201)
        .json(error("You are suspended by admin", res.statusCode));
    }

    const token = await verifyUser.generateUserAuthToken();

    res
      .header("x-auth-token-user", token)
      .header("access-control-expose-headers", "x-auth-token-admin")
      .status(201)
      .json(success(res.statusCode, "Logged In", { verifyUser, token }));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error in Logging in", res.statusCode));
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please porvide valid email", res.statusCode));
    }
    const updateUserPassword = await NewStarUser.findOne({ email });
    if (!updateUserPassword) {
      return res.status(201).json(error("User not registered", res.statusCode));
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    await NewStarUser.findOneAndUpdate({ email }, { otp: otp });
    res.status(201).json(success(res.statusCode, "OTP Sent", { otp }));
  } catch (err) {
    console.log(err);
    res.status(201).json(error("error", res.statusCode));
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(201).json(error("Email is invalid", res.statusCode));
    }
    const verifyUser = await NewStarUser.findOne({ email: email });
    if (!otp) {
      return res.status(201).json(error("Please porvide otp", res.statusCode));
    }
    if (!verifyUser) {
      return res
        .status(201)
        .json(error("UserID is not registered", res.statusCode));
    }
    if (verifyUser.otp !== otp) {
      return res.status(201).json(error("Invalid OTP", res.statusCode));
    }
    await NewStarUser.findOneAndUpdate({ email: email }, { otp: "" });
    res.status(201).json(success(res.statusCode, "OTP Verified", {}));
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json(error("Please provide right Credential", res.statusCode));
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password) {
      return res
        .status(201)
        .json(error("Please Provide UserID and Password", res.statusCode));
    }
    const updateUserPassword = await NewStarUser.findOne({ email }).select(
      "password"
    );

    if (!updateUserPassword) {
      return res
        .status(201)
        .json(error("User is not registered", res.statusCode));
    }

    updateUserPassword.password = password;
    await updateUserPassword.save();
    res
      .status(201)
      .json(
        success(
          res.statusCode,
          "Password Updated Successfully",
          updateUserPassword
        )
      );
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Invalid", res.statusCode));
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    // console.log(req.body);
    const user = await NewStarUser.findById(req.user._id).select("password");
    if (!(await user.correctPassword(oldPassword, user.password))) {
      return res
        .status(201)
        .json(error("Invalid old Password", res.statusCode));
    }
    user.password = newPassword;
    await user.save();
    res
      .status(201)
      .json(
        success(res.statusCode, "Password is Changed Successfully", { user })
      );
  } catch (err) {
    console.log(err);
    res.status(201).json(error("Invalid Password", res.statusCode));
  }
};

exports.updateAddress = async (req, res) => {
  const { addressLine } = req.body;
  // console.log(req.body);
  if (!addressLine) {
    return res.status(201).json(error("Please enter address", res.statusCode));
  }
  try {
    const user = await NewStarUser.findById(req.user._id).select("addressLine");
    if (!user) {
      return res.status(201).json(error("User not found", res.statusCode));
    }
    console.log(user);
    user.addressLine = addressLine;
    await user.save();
    res
      .status(201)
      .json(success(res.statusCode, "address updated successfully", user));
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(
        error("Address not updated & Something went wromg", res.statusCode)
      );
  }
};

exports.editProfile = async (req, res) => {
  try {
    // console.log(req.files);
    const { firstName, lastName, phoneNumber, addressLine } = req.body;
    // console.log(req.body);
    // if(!validator.isEmail(req.body.email)){
    //     return res.status(201).json(error("Please enter a valid email"))
    // }
    const user = await NewStarUser.findById(req.user._id);
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (addressLine) {
      user.addressLine = addressLine;
    }
    if (req.files.length) {
      profile = `${req.files[0].destination.replace("/public/images")}/${
        req.files[0].filename
      }`;
    }
    await user.save();
    res
      .status(201)
      .json(success(res.statusCode, "Profile updated Successfully", { user }));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while profile updation"));
  }
};
