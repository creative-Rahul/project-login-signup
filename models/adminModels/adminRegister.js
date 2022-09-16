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
    adminProfile: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    otp:{
        type:Number
    },
    adminTokens: [{
        adminToken: {
            type: String
        }
    }]
})

adminRegisterSchema.methods.changeAdminPassword= async function(plainPassword,hashedPassword){
    return await bcrypt.compare(plainPassword,hashedPassword)
}


adminRegisterSchema.methods.generateAdminAuthToken = async function () {
    try {
        const adminToken = jwt.sign({ _id: this._id }, "thisismytokenforadmin")
        this.adminTokens = this.adminTokens.concat({ adminToken: adminToken });
        await this.save()
        return adminToken;
    } catch (err) {
        console.log("Token Error "+err)
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