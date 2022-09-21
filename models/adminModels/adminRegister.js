const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const adminRegisterSchema = mongoose.Schema({
    adminId: {
        type: Number,
        default: new Date().getTime()
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    adminRole: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminProfile: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number
    },
    tokens: [{
        token: {
            type: String
        }
    }]
},{ timestamps: true })

adminRegisterSchema.methods.changeAdminPassword = async function (plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}


adminRegisterSchema.methods.generateAdminAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, "thisismytokenforadmin")
        this.tokens = this.tokens.concat({ token: token });
        await this.save()
        return token;
    } catch (err) {
        console.log("Token Error " + err)
    }
}

adminRegisterSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
})



const NewStarAdmin = mongoose.model("NewStarAdmin", adminRegisterSchema)

module.exports = NewStarAdmin;