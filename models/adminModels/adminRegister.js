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
}, { timestamps: true }, { collection: "NewStarAdmin" })

adminRegisterSchema.methods.changeAdminPassword = async function (plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

adminRegisterSchema.methods.generateAdminAuthToken = function () {
    const token = jwt.sign({ _id: this._id, }, "ultra-security", { expiresIn: "1d", });
    return token;
};

adminRegisterSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
})



const NewStarAdmin = mongoose.model("NewStarAdmin", adminRegisterSchema)

module.exports = NewStarAdmin;