const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const newUserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3
    },
    lastName: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    verified: {
        type: Boolean,
        default: false
    }
})


newUserSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({_id:this._id}, "thisismyjsonwebtoken")
        return token
    } catch (err) {
        console.log(`Token Error ${err}`);
    }
}

// newUserSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10)
//     }
//     next()
// })

const NewStarUser = mongoose.model("NewStarUser", newUserSchema)



module.exports = NewStarUser;