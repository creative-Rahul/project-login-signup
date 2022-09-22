const jwt = require("jsonwebtoken");
const { error } = require("../service_response/userApiResponse")


function tokenAdminAuthorisation(req, res, next) {
    const token = req.header("x-auth-token-admin");
    if (!token)
        return res
            .status(401)
            .json(error("Access Denied. No token provided.", res.statusCode));
    try {
        const decoded = jwt.verify(token, "ultra-security");
        req.admin = decoded;
        next();
    } catch (ex) {
        return res
            .status(400)
            .json(error("You are not Authenticated Yet", res.statusCode));
    }
}



module.exports = tokenAdminAuthorisation;