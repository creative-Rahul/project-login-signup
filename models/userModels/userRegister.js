const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const newUserSchema = mongoose.Schema(
  {
    userId: {
      type: Number,
      default: new Date().getTime(),
    },
    companyName: {
      type: String,
      required: true,
    },
    dba: {
      type: String,
      required: true,
    },
    addressLine: [
      {
        type: String,
        required: true,
      },
    ],
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipcode: {
      type: Number,
      required: true,
    },
    profileImage: {
      type: String,
      // required:true
    },
    federalTaxId: {
      type: String,
      // required:true
    },
    businessLicense: {
      type: String,
      // required:true
    },
    salesTaxId: {
      type: String,
      // required:true
    },
    tobaccoLicence: {
      type: String,
      // required: true,
    },
    firstName: {
      type: String,
      required: true,
      min: 3,
    },
    lastName: {
      type: String,
      // required: true,
      min: 3,
    },
    accountOwnerId: {
      type: String,
      // required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    otp: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    quotation: {
      type: Boolean,
      default: false,
    },
    heardAboutUs: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { collection: "NewStarUser" }
);

newUserSchema.methods.correctPassword = async (
  plainPassword,
  hashedPassword
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

newUserSchema.methods.generateUserAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "ultra-security", {
    expiresIn: "1d",
  });
  return token;
};

newUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    return (this.password = await bcrypt.hash(this.password, 10));
  }
  next();
});

const NewStarUser = mongoose.model("NewStarUser", newUserSchema);

module.exports = NewStarUser;
