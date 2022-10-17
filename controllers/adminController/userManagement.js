const csv = require("csvtojson");
const validator = require("validator");
const NewStarUser = require("../../models/userModels/userRegister");
const { error, success } = require("../../service_response/userApiResponse");

// View all users profile
exports.getAllUsers = async (req, res) => {
  try {
    const users = await NewStarUser.find().select("-password");
    res
      .status(201)
      .json(success(res.statusCode, "All Users fetched Successfully", users));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while fetching users", res.statusCode));
  }
};

// PENDING APPROVED & RETURNED users  -> User Management -> Admin
exports.allUsersList = async (req, res) => {
  const { type, from, to } = req.body;
  // console.log(req.body);
  if (!type) {
    return res
      .status(201)
      .json(error("Please provide user type", res.statusCode));
  }
  try {
    if (!from || !to) {
      const usersList = await NewStarUser.aggregate([
        { $match: { isVerified: type } },
        { $project: { password: 0 } },
      ]);
      // console.log(usersList);
      res.status(201).json(success(res.statusCode, `${type} users`, usersList));
    } else {
      const usersList = await NewStarUser.find({
        isVerified: type,
        createdAt: {
          $gte: from,
          $lte: to,
        },
      });
      // console.log(usersList);
      res.status(201).json(success(res.statusCode, `${type} users`, usersList));
    }
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(error("Error while fetching approved users", res.statusCode));
  }
};

// Counting of Pending Approved and Rejected Users -> Admin
exports.usersCount = async (req, res) => {
  try {
    const users = await NewStarUser.aggregate([
      { $group: { _id: "$isVerified", count: { $sum: 1 } } },
    ]);
    res.status(201).json(success(res.statusCode, "Number of Users", users));
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(error("Error while fetching number of Users", res.statusCode));
  }
};

// Admin authorised user
exports.adminAuthorisedUser = async (req, res) => {
  try {
    const findUser = await NewStarUser.findByIdAndUpdate(
      req.params._id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(201)
      .json(
        success(res.statusCode, "User approved Successfully", { findUser })
      );
  } catch (err) {
    console.log(err);
    res.status(201).json(error("Error while authorising user", res.statusCode));
  }
};

// Get a User by Object _id -> admin
exports.getUser = async (req, res) => {
  try {
    const user = await NewStarUser.findById(req.params._id);
    res
      .status(201)
      .json(success(res.statusCode, "User fetched Successfully", user));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while fetching user", res.statusCode));
  }
};

// Reject user due incomplete registration details -> Admin
exports.rejectUser = async (req, res) => {
  // const {} = req.body
  try {
    const findInDB = await NewStarUser.findById(req.params._id);
    const errorObj = {
      body: req.body,
    };
    // console.log(errorObj);
    findInDB.isVerified = "REJECTED";
    await findInDB.save();
    res
      .status(201)
      .json(
        success(
          res.statusCode,
          `${findInDB.firstName} ${findInDB.lastName} is Rejected`,
          errorObj
        )
      );
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error in rejection", res.statusCode));
  }
};

// Suspend or Resume User -> Admin
exports.userStatus = async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res
      .status(201)
      .json(error("Please provide new status", res.statusCode));
  }
  try {
    const user = await NewStarUser.findById(req.params._id).select("status");
    user.status = status;
    await user.save();
    // console.log(user);
    if (user.status == true) {
      return res
        .status(201)
        .json(success(res.statusCode, `User enabled successfully`, user));
    }
    if (user.status == false) {
      return res
        .status(201)
        .json(success(res.statusCode, `User disabled successfully`, user));
    }
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while adding user", res.statusCode));
  }
};

// import Users from CSV file -> Admin
exports.importUsers = async (req, res) => {
  // console.log(req.files)
  if (!req.files) {
    return res
      .status(201)
      .json(error("Please provide Excel Sheet", res.statusCode));
  }
  var userNameAndPassword = [];
  try {
    if (req.files.length === 0) {
      return res
        .status(201)
        .json(error("Please provide Excel Sheet", res.statusCode));
    }
    const csvFilePath = req.files[0].path;
    const jsonArray = await csv().fromFile(csvFilePath);
    // console.log(jsonArray);
    jsonArray.forEach((jsonArray) => {
      // console.log(jsonArray);
      for (let key in jsonArray) {
        const randomPass = Math.floor(10000 + Math.random() * 90000);
        jsonArray["password"] = randomPass;
        jsonArray["isVerified"] = "APPROVED";
      }
      // console.log({
      //     email: jsonArray.email,
      //     password: jsonArray.password
      // })
      userNameAndPassword.push({
        email: jsonArray.email,
        password: jsonArray.password,
      });
    });
    try {
      const importedData = await NewStarUser.create(jsonArray);
      // console.log(importedData);
      res.status(201).json(
        success(res.statusCode, "Successfully Imported", {
          importedData,
          userNameAndPassword,
        })
      );
    } catch (err) {
      console.log(err);
      res.status(401).json(error("Validation Error", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(error("Error while importing the data", res.statusCode));
  }
};

// Adding a Single User -> Admin
exports.addUser = async (req, res) => {
  try {
    // console.log(req.files)
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
    } = req.body;
    // console.log(req.body);

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
    const tobaccoLicence = req.files[4]?.path;
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
      federalTaxId: federalTaxId,
      businessLicense: businessLicense,
      salesTaxId: salesTaxId,
      tobaccoLicence: tobaccoLicence,
      firstName: firstName,
      lastName: lastName,
      accountOwnerId: accountOwnerId,
      email: email,
      isVerified: "APPROVED",
      phoneNumber: phoneNumber,
      password: password,
    });
    const registerd = await newuser.save();
    console.log("User's password -> " + password);
    res.status(201).json(
      success(res.statusCode, "Registered Successfully", {
        registerd,
        password,
      })
    );
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(error("Something went Wrong While adding a User", res.statusCode));
  }
};

//Edit a User Profile -> Admin
exports.editUserProfile = async (req, res) => {
  try {
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
    } = req.body;

    // console.log(req.body);
    // console.log(req.files.length);

    // const federalTaxId = req.files[0]?.fieldname;
    // console.log(federalTaxId);
    // const businessLicense = req.files[1]?.fieldname;
    // const salesTaxId = req.files[2]?.fieldname;
    // const accountOwnerId = req.files[3]?.fieldname;
    // const tobaccoLicence = req.files[4]?.fieldname;

    const editUser = await NewStarUser.findById(req.params._id);

    if (companyName) {
      editUser.companyName = companyName;
    }
    if (dba) {
      editUser.dba = dba;
    }
    if (addressLine) {
      editUser.addressLine = addressLine;
    }
    if (city) {
      editUser.city = city;
    }
    if (state) {
      editUser.state = state;
    }
    if (zipcode) {
      editUser.zipcode = zipcode;
    }
    if (firstName) {
      editUser.firstName = firstName;
    }
    if (lastName) {
      editUser.lastName = lastName;
    }
    if (email) {
      editUser.email = email;
    }
    if (phoneNumber) {
      editUser.phoneNumber = phoneNumber;
    }
    if (quotation) {
      editUser.quotation = quotation;
    }
    for (let i = 0; i < req.files.length; i++) {
      if (req.files[i].fieldname == "federalTaxId") {
        editUser.federalTaxId = `${req.files[i].destination.replace(
          "./public/images"
        )}/${req.files[i].filename}`;
      }
      if (req.files[i].fieldname == "businessLicense") {
        editUser.businessLicense = `${req.files[i].destination.replace(
          "./public/images"
        )}/${req.files[i].filename}`;
      }
      if (req.files[i].fieldname == "salesTaxId") {
        editUser.salesTaxId = `${req.files[i].destination.replace(
          "./public/images"
        )}/${req.files[i].filename}`;
      }
      if (req.files[i].fieldname == "accountOwnerId") {
        editUser.accountOwnerId = `${req.files[i].destination.replace(
          "./public/images"
        )}/${req.files[i].filename}`;
      }
      if (req.files[i].fieldname == "tobaccoLicence") {
        editUser.tobaccoLicence = `${req.files[i].destination.replace(
          "./public/images"
        )}/${req.files[i].filename}`;
      }
    }
    await editUser.save();
    res
      .status(201)
      .json(
        success(res.statusCode, "User Deatils Updated Successfully", editUser)
      );
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while updation", res.statusCode));
  }
};
