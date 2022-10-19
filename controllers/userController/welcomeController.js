const {error,success} = require("../../service_response/userApiResponse")
const {PrivacyPolicy} = require("../../models/adminModels/cmsSchema")


exports.privacyPolicy=async (req,res)=>{
    try {
        const pp = await PrivacyPolicy.find()
        res.status(201).json(success(res.statusCode,"Privacy Policy",pp))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in fetching Privacy Policy",res.statusCode))        
    }
}
