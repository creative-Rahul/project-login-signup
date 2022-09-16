const validator = require("validator")
const { success, error } = require("../../service_response/userApiResponse")
const NewStarAdmin = require("../../models/adminModels/adminRegister")
const res = require("express/lib/response")

const bcrypt = require("bcrypt")


exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, adminRole, password } = req.body
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
            adminProfile: `${req.files[0].destination.replace("./public/images", "")}/${req.files[0].filename}`,
            // adminProfile:req.files[0].path,
            password: password
        })

        const adminToken = await newAdminUser.generateAdminAuthToken()
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
        // let password1 = req.body
        // const password = password1.toString()
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Please enter valid Email", res.statusCode))
        }
        if (!password) {
            return res.status(201).json(error("Please enter Password"))
        }
        const verifyAdmin = await NewStarAdmin.findOne({ email: email })
        const adminToken = await verifyAdmin.generateAdminAuthToken()

        res.cookie("jwt", adminToken, {
            expires: new Date(Date.now() + 2 * 60000)
        })

        if (!verifyAdmin) {
            return res.status(201).json(error("Email is not Registered", res.statusCode))
        }



        const isPasswordMatched = bcrypt.compare(password, verifyAdmin.password)
        if (isPasswordMatched) {
            return res.status(201).json(success(res.statusCode, "Logged in", verifyAdmin))
        }
        if (!isPasswordMatched) {
            return res.status(201).json(error("Wrong Password", res.statusCode))
        }


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
        const { email, oldPassword, newPassword } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Invalid Email", res.statusCode))
        }
        const verifyAdminEmail = await NewStarAdmin.findOne({ email: email }).select("password")
        // if(!verifyAdminEmail){
        //     return res.status(201).json(error("Email not registered",res.statusCode))
        // }
        if (!await verifyAdminEmail.changeAdminPassword(oldPassword, verifyAdminEmail.password)) {
            return res.status(201).json(error("Old Password not matched", res.statusCode))
        }
        verifyAdminEmail.password = newPassword;
        await verifyAdminEmail.save()
        res.status(201).json(success(res.statusCode, "Password Updated Successfully", verifyAdminEmail))


    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while changing Password", res.statusCode))
    }
}


exports.adminLogout = async (req, res) => {
    try {
        req.admin.adminTokens = []
        res.clearCookie("jwt")
        await req.admin.save()
        res.status(201).json(success(res.statusCode, "Logout successfully", {}))

    } catch (err) {
        console.log(err);
        res.status(401).json(error("Something went wrong", res.statusCode))
    }
}