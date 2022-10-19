const mongoose = require("mongoose");


// Slide 1
const HomeBannerSchema = mongoose.Schema({
  slide:{
    type:String,
    default:"Slide1"
  },
  banner:{
    type:String
  },
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  }
},{timestamps:true},{collection:"HomeBanner"})

const HomeBanner = mongoose.model("HomeBanner",HomeBannerSchema)



// About Us Schema
const aboutUsSchema = mongoose.Schema({
    title:{
        type:String,
        default:"AboutUs"
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true},{collection:"About"})

const About = mongoose.model("About",aboutUsSchema)


// Terms and Conditions Schema
const TnCSchema = mongoose.Schema({
    title:{
        type:String,
        default:"TnC"
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true},{collection:"TermsAndConditions"})

const TermsAndConditions = mongoose.model("TermsAndConditions",TnCSchema)


// Privacy Policy Schema
const privacyPolicySchema = mongoose.Schema({
    title:{
        type:String,
        default:"PrivacyPolicy"
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true},{collection:"PrivacyPolicy"})

const PrivacyPolicy = mongoose.model("PrivacyPolicy",privacyPolicySchema)


module.exports = {HomeBanner,About,TermsAndConditions,PrivacyPolicy};
