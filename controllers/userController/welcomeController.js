const { error, success } = require("../../service_response/userApiResponse");
const { PrivacyPolicy, TermsAndConditions, About } = require("../../models/adminModels/cmsSchema");

exports.privacyPolicy = async (req, res) => {
  try {
    const pp = await PrivacyPolicy.find();
    res.status(201).json(success(res.statusCode, "Privacy Policy", pp));
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(error("Error in fetching Privacy Policy", res.statusCode));
  }
};


exports.tAndC = async(req,res)=>{
    try {
        const tnC = await TermsAndConditions.find()
        res.status(201).json(success(res.statusCode,"Terms and Conditions",tnC))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error fetching Terms and Conditons",res.statusCode))
    }
}

exports.aboutUs = async(req,res)=>{
  try {
    const about = await About.find()
    res.status(201).json(success(res.statusCode,"About Us",about))
} catch (err) {
    console.log(err);
    res.status(401).json(error("Error fetching About Us",res.statusCode))
}
}
