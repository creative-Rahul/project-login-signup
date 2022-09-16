const validator = require("validator")
const NewStarUser = require("../../models/userModels/registerSchema")
const bcrypt = require("bcrypt")
const res = require("express/lib/response")
const { success, error } = require("../../service_response/userApiResponse")
const multer = require("multer")
// const upload = require("../../middleware/upload")
// const path = require("path")

exports.home = (req, res) => {
    res.send("Welcome to home page")
}

exports.register = async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.files[0])
        // console.log(req.files[1])
        // console.log(req.file[1])
        const { companyName, dba, addressLine, city, state, zipcode, firstName, lastName, email, phoneNumber } = req.body;

        if (!validator.isAlpha(firstName)) {
            return res.status(201).json(error("Please enter valid name", res.statusCode))
        }
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("please enter valid email", res.statusCode))
        }
        const verifyEmail = await NewStarUser.findOne({ email: email });
        // console.log(!verifyEmail);
        if (verifyEmail) {
            return res.status(200).json(error("Email Already Registered", res.statusCode));
        }
        const federalTaxId = req.files[0].path
        const businessLicense = req.files[1].path
        const salesTaxId = req.files[2].path
        const tobaccoLicence = req.files[4]?.path
        const accountOwnerId = req.files[3].path

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
            phoneNumber: phoneNumber,
            password: req.body.firstName
        })

        const token = await newuser.generateUserAuthToken()
        const registerd = await newuser.save()
        res.status(201).json(success(res.statusCode, "Registered Successfully", registerd))

    } catch (err) {
        console.log(err);
        res.status(401).send({
            error: true,
            error_code: 401,
            message: "Wrong Input",
            // results: registerd
        })
    }
}



exports.login = async (req, res) => {
    try {
        // console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        const verifyUser = await NewStarUser.findOne({ email: email })

        const token = await verifyUser.generateUserAuthToken()

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + (10 * 60000))
        })
        const isPasswordMatched = await bcrypt.compare(password, verifyUser.password)
        if (isPasswordMatched) {
            res.status(201).json(success(res.statusCode, "Logged In", verifyUser))
        } else {
            res.status(201).json(error("Wrong Password", res.statusCode))
        }
    } catch (err) {
        console.log(err);
        res.status(401).send({
            error: true,
            error_code: 401,
            message: "Wrong Credential",
            // results: registerd
        })
    }
}



exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Please porvide valid email", res.statusCode))
        }
        const updateUserPassword = await NewStarUser.findOne({ email })
        if (!updateUserPassword) {
            return res.status(201).json(error("User not registered", res.statusCode))
        }
        const otp = Math.floor(1000 + Math.random() * 9000)
        await NewStarUser.findOneAndUpdate({ email }, { otp: otp })
        res.status(201).json(success(res.statusCode, "OTP Sent", { otp }))

    } catch (err) {
        console.log(err);
        res.status(201).json(error("error", res.statusCode))
    }
}


exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!validator.isEmail(email)) {
            return res.status(201).json(error("Email is invalid", res.statusCode))
        }
        const verifyUser = await NewStarUser.findOne({ email: email })
        // console.log(verifyUser.otp !== otp);
        // if (!(userId.toString().length === 13)) {
        //     res.status(201).json(error("Please porvide valid userID", res.statusCode))
        // }
        if (!otp) {
            return res.status(201).json(error("Please porvide otp", res.statusCode))
        }
        if (!verifyUser) {
            return res.status(201).json(error("UserID is not registered", res.statusCode))
        }
        if (verifyUser.otp !== otp) {
            return res.status(201).json(error("Invalid OTP", res.statusCode))
        }
        await NewStarUser.findOneAndUpdate({ email: email }, { otp: "" })
        res.status(201).json(success(res.statusCode, "OTP Verified", {},))

    } catch (err) {
        console.log(err);
        res.status(403).json(error("Please provide right Credential", res.statusCode))
    }

}


exports.updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body
        // console.log(req.body);
        if (!email || !password) {
            return res.status(201).json(error("Please Provide UserID and Password", res.statusCode))
        }
        const updateUserPassword = await NewStarUser.findOne({ email }).select("password")

        if (!updateUserPassword) {
            return res.status(201).json(error("User is not registered", res.statusCode))
        }

        updateUserPassword.password = password
        await updateUserPassword.save()
        res.status(201).json(success(res.statusCode, "Password Updated Successfully", updateUserPassword))

    } catch (err) {
        console.log(err);
        res.status(401).json(error("Invalid", res.statusCode))
    }

}

exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        // console.log(req.body);

        const changeUserPass = await NewStarUser.findOne({ email: email }).select("password")
        if (!await changeUserPass.passwordChange(oldPassword, changeUserPass.password)) {
            return res.status(201).json(error("Invalid old Password", res.statusCode))
        }

        changeUserPass.password = newPassword
        await changeUserPass.save()
        res.status(201).json(success(res.statusCode, "Password is Changed Successfully", changeUserPass))


    } catch (err) {
        console.log(err)
        res.status(201).json(error("Invalid Password", res.statusCode))
    }
}




exports.logout = async (req, res) => {
    try {
        // for single device logout
        // req.user.tokens = req.user.tokens.filter((currElement)=>{
        //     return currElement.token !== req.token;
        // })

        // logout from all devices
        req.user.tokens = [];

        res.clearCookie("jwt")
        // console.log("Logout Successfully");
        await req.user.save()
        res.status(201).json(success(res.statusCode, "Logged out Successfully", {}))
    } catch (error) {
        res.status(500).send(error)
    }

}