const validator = require("validator")
const { success, error } = require("../../service_response/userApiResponse")
const NewStarAdmin = require("../../models/adminModels/adminRegister")
const csv = require("csvtojson")

const bcrypt = require("bcrypt")
const NewStarUser = require("../../models/userModels/registerSchema")
const res = require("express/lib/response")


exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, adminRole, password, isAdmin } = req.body
        // console.log(req.files);
        if (!firstName) {
            return res.status(201).json(error("Please enter valid name", res.statusCode))
        }
        if (!lastName) {
            return res.status(201).json(error("Please enter valid name", res.statusCode))
        }
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Please enter valid email", res.statusCode))
        }
        if (!adminRole) {
            return res.status(201).json(error("Please enter Admin Role", res.statusCode))
        }
        if (!password) {
            return res.status(201).json(error("Please enter Password", res.statusCode))
        }
        if (!req.files.length) {
            return res.status(201).json(error("Please provide profile picture"))
        }
        const verifyEmail = await NewStarAdmin.findOne({ email: email })
        if (verifyEmail) {
            return res.status(201).json(error("Email is already Registered", res.statusCode))
        }

        const newAdminUser = new NewStarAdmin({
            firstName: firstName,
            lastName: lastName,
            email: email,
            adminRole: adminRole,
            isAdmin: isAdmin,
            adminProfile: `${req.files[0].destination.replace("./public/images", "")}/${req.files[0].filename}`,
            // adminProfile:req.files[0].path,
            password: password
        })

        // const token = await newAdminUser.generateAdminAuthToken()
        const registered = await newAdminUser.save()
        res.status(201).json(success(res.statusCode, "Admin has registered Successfully", registered))


    } catch (err) {
        console.log(err)
        res.status(401).json(error("Error while registration", res.statusCode))
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Please enter valid Email", res.statusCode))
        }
        if (!password) {
            return res.status(201).json(error("Please enter Password"))
        }
        const verifyAdmin = await NewStarAdmin.findOne({ email: email })

        const token = await verifyAdmin.generateAdminAuthToken()

        if (!verifyAdmin) {
            return res.status(201).json(error("Email is not Registered", res.statusCode))
        }

        if (!await (verifyAdmin.changeAdminPassword(password, verifyAdmin.password))) {
            return res.status(201).json(error("Wrong Password", res.statusCode))
        }

        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + 10 * 60000)
        // })
        res.header("x-auth-token-admin", token)
            .header("access-control-expose-headers", "x-auth-token-admin")
            .status(201).json(success(res.statusCode, "Logged in", { verifyAdmin, token }))

    } catch (err) {
        console.log(err);
        res.status(201).json(error("Please enter valid Credential", res.statusCode))
    }
}



exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Please enter a valid mail", res.statusCode))
        }
        const updateAdminPassword = await NewStarAdmin.findOne({ email: email })
        if (!updateAdminPassword) {
            return res.status(201).json(error("User not registered", res.statusCode))
        }
        const otp = Math.floor(1000 + Math.random() * 9000)
        await NewStarAdmin.findOneAndUpdate({ email: email }, { otp: otp })
        res.status(201).json(success(res.statusCode, "Otp Sent", { otp }))

    } catch (err) {
        console.log(err);
        res.status(401).json(error("Wrong Credentials"))
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Please enter valid mail", res.statusCode))
        }
        if (!otp) {
            return res.status(201).json(error("Please enter OTP", res.statusCode))
        }
        const verifyAdminOtp = await NewStarAdmin.findOne({ email })
        if (!verifyAdminOtp) {
            return res.status(201).json(error("User not registered", res.statusCode))
        }
        if (verifyAdminOtp.otp !== otp) {
            return res.status(201).json("Invalid OTP", res.statusCode)
        }
        await NewStarAdmin.findOneAndUpdate({ email: email }, { otp: "" })
        res.status(201).json(success(res.statusCode, "OTP Verified", {}))

    } catch (err) {
        console.log(err);
        res.status(201).json("Something went wrong while verification", res.statusCode)
    }
}

exports.updatePassword = async (req, res) => {
    try {
        console.log(req.body);
        const { email } = req.body;
        const password = req.body.newPassword
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Email is Invalid", res.statusCode))
        }
        const updateAdminPassword = await NewStarAdmin.findOne({ email: email }).select("password")
        if (!updateAdminPassword) {
            return res.status(201).json(error("Please enter password", res.statusCode))
        }
        updateAdminPassword.password = password
        await updateAdminPassword.save()
        res.status(201).json(success(res.statusCode, "Password Updated Sucessfully", updateAdminPassword))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Something went wrong in password Updation", res.statusCode, err))
    }
}


exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const admin = await NewStarAdmin.findById(req.admin._id).select("password")

        if (!await admin.changeAdminPassword(oldPassword, admin.password)) {
            return res.status(201).json(error("Old Password not matched", res.statusCode))
        }
        admin.password = newPassword;
        await admin.save()
        res.status(201).json(success(res.statusCode, "Password Updated Successfully", { admin }))


    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while changing Password", res.statusCode))
    }
}


exports.adminLogout = async (req, res) => {
    try {
        req.admin.tokens = []
        res.clearCookie("jwt")
        await req.admin.save()
        res.status(201).json(success(res.statusCode, "Logout successfully", {}))

    } catch (err) {
        console.log(err);
        res.status(401).json(error("Something went wrong", res.statusCode))
    }
}


exports.getAdminData = async (req, res) => {
    try {
        const admin = await NewStarAdmin.findById(req.admin._id).select("-password")
        res.status(201).json(success(res.statusCode, "Admin Data fetched Successfully", { admin }))
    } catch (err) {
        console.log(err);
        res.status(401).json("Error while fetching admin data", res.statusCode)
    }
}

exports.getAllAdmin = async (req, res) => {
    try {
        const admin = await NewStarAdmin.find().select("-password")
        res.status(201).json(success(res.statusCode, "Admin Data fetched Successfully", { admin }))
    } catch (err) {
        console.log(err);
        res.status(401).json("Error while fetching admin data", res.statusCode)
    }
}


exports.getAllUsers = async (req, res) => {
    try {
        const users = await NewStarUser.find().select("-password")
        res.status(201).json(success(res.statusCode, "All Users fetched Successfully", users))
    } catch (err) {
        console.log(err);
        res.status(201).json(error("Error while fetching users", res.statusCode))
    }
}


// const adminAuthorisedUser = asunc (req,res)=>{
//     try {

        
//     } catch (err) {
//         console.log(err);
//         res.status(201).json(error("Error while authorising user",res.statusCode))
        
//     }
// }




// exports.importUsers = async (req, res) => {
//     // console.log(req.files);
//     const csvFilePath = req.files[0].path
//     try {
//         const jsonArray = await csv().fromFile(csvFilePath)
//         console.log(jsonArray.length);
//         let arr2 = jsonArray.push({ password: "password" })
//         console.log(jsonArray[0]);
        
//         // for (let i = 0; i < jsonArray.length; i++) {
//         //     // jsonArray.push()

//         //     const newObj = jsonArray.push({ password: "password" })
//         //     console.log(jsonArray);
//         //     // break

//         // }
//         // const importedData = await NewStarUser.insertMany(jsonArray)
//         // const importedData =  NewStarUser.insertMany(jsonArray, (err, results) => {
//         //     if (err) {
//         //         console.log(err);
//         //         return res.status(401).json(error("Validation Error", res.statusCode))
//         //     }
//         //     else {
//         //         console.log(results);
//         //     }
//         // })
//         // console.log(importedData);
//         // {
//         // let arr = [{fname:"rahul",lname:"Yadav"},{fname:"Alok",lname:"yadav"}]
//         // const arr2 = arr.push({city:"blp"})
//         // console.log(arr);
//         // console.log(arr2[0]);
//         // console.log(arr2[1]);

//         // }
//         res.status(201).json(success(res.statusCode, "Successfully Imported", jsonArray))
//     } catch (err) {
//         console.log(err);
//         res.status(401).json(error("Error while importing the data", res.statusCode))
//     }
// }