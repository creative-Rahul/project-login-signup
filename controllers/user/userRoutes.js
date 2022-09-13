const validator = require("validator")
const NewStarUser = require("../../models/registerSchema")
const bcrypt = require("bcrypt")
const res = require("express/lib/response")
const { success, error } = require("../../service_response/userApiResponse")
const multer = require("multer")
const upload = require("../../middleware/upload")
const path = require("path")

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
            res.status(201).json(error("Please enter valid name", res.statusCode))
        }
        if (!validator.isEmail(email)) {
            res.status(201).json(error("please enter valid email", res.statusCode))
        }
        const verifyEmail = await NewStarUser.findOne({ email: email });
        // console.log(!verifyEmail);
        if (verifyEmail) {
            return res.status(200).json(error("Email Already Registered", res.statusCode));
        }

        const newuser = new NewStarUser({
            companyName: companyName,
            dba: dba,
            addressLine: addressLine,
            city: city,
            state: state,
            zipcode: zipcode,
            federalTaxId: req.files[0].path,
            businessLicense: req.files[1].path,
            salesTaxId: req.files[2].path,
            tobaccoLicence: req.files[3].path,
            firstName: firstName,
            lastName: lastName,
            accountOwnerId: req.files[4].path,
            email: email,
            phoneNumber: phoneNumber,
        })

        const token = await newuser.generateAuthToken()
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

        const token = await verifyUser.generateAuthToken()

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + (10 * 60000))
        })

        const isPasswordMatched = bcrypt.compare(password, verifyUser.password)
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
    const { email } = req.body
    if (!email) {
        res.status(200).json(error("Please provide email", res.statusCode))
    }
    if (!validator.isEmail(email)) {
        res.status(200).json(error("Invalid Email", res.statusCode))
    }
    try {
        const updateUserPassword = await NewStarUser.findOne({ email })
        if (!updateUserPassword) {
            res.status(201).json(error("User not registered", res.statusCode))
        }
        const otp = Math.floor(1000 + Math.random() * 9000)
        await NewStarUser.findOneAndUpdate({ email }, { otp: otp })
        res.status(201).json(success(res.statusCode, "OTP Verified", { otp }))

    } catch (err) {
        console.log(err);
        res.status(201).json(error("error", res.statusCode))
    }
}


exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body
    if (!email) {
        res.status(201).json(error("Please porvide email", res.statusCode))
    }
    if (!validator.isEmail(email)) {
        res.status(201).json(error("Invalid email", res.statusCode))
    }
    if (!otp) {
        res.status(201).json(error("Please porvide otp", res.statusCode))
    }
    try {
        const verifyUser = await NewStarUser.findOne({ email })
        console.log(verifyUser);
        if (!verifyUser) {
            res.status(201).json(error("Email not registered", res.statusCode))
        }
        if (verifyUser.otp !== otp) {
            res.status(201).json(error("Invalid OTP", res.statusCode))
        }
        await NewStarUser.findOneAndUpdate({ email: email }, { otp: "" })
        res.status(201).json(success(res.statusCode, "OTP Verified", {},))

    } catch (err) {
        console.log(err);
        res.status(403).json(error("Please provide right Credential", res.statusCode))
    }
}


exports.updatePassword = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body);
    if (!email || !password) {
        res.status(201).json(error("Please Provide email and Password", res.statusCode))
    }
    if (!validator.isEmail(email)) {
        res.status(201).json(error("Please provide Valid email", res.statusCode))
    }
    try {
        const updateuserPassword = await NewStarUser.findOne({ email }).select("password")
        if (!updateuserPassword) {
            res.status(201).json(error("Email is not registered", res.statusCode))
        }
        // else{
        //     await NewStarUser.findOneAndUpdate({email:email},{password:password})
        // }
        updateuserPassword.password = password
        await updateuserPassword.save()
        res.status(201).json(success(res.statusCode, "Password Updated Successfully", updateuserPassword))

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
        // console.log(changeUserPass);
        // const bool = await bcrypt.compare(oldPassword, changeUserPass.password)
        // console.log(bool);
        if (!await changeUserPass.passwordChange(oldPassword, changeUserPass.password)) {
            res.status(201).json(error("Invalid old Password", res.statusCode))
        }
        // console.log(changeUserPass.password);
        else {
            changeUserPass.password = newPassword
            await changeUserPass.save()
            res.status(201).json(success(res.statusCode, "Password is Changed Successfully", changeUserPass))
        }

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
        console.log("Logout Successfully");
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(500).send(error)
    }

}