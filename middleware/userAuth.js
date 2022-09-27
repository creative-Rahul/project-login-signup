const jwt = require("jsonwebtoken");


const { error } = require("../service_response/userApiResponse");

function tokenAuthorisationUser(req, res, next) {
    const token = req.header("x-auth-token-user");
    if (!token)
        return res
            .status(401)
            .json(error("Access Denied. No token provided.", res.statusCode));
    try {
        const decoded = jwt.verify(token, "ultra-security");
        req.user = decoded;
        next();
    } catch (ex) {
        return res
            .status(400)
            .json(error("You are not Authenticated Yet", res.statusCode));
    }
}


// const adminAuthorizedUser = (req, res, next) => {
//     tokenAuthorisationUser(req, res, () => {
//         if (req.user.isVerified) {
//             next()
//         } else {
//             res.status(401).json("You are not allowed", res.statusCode)
//         }
//     })
// }


module.exports = tokenAuthorisationUser;