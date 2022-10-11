const csv = require("csvtojson")
const NewStarUser = require("../../models/userModels/userRegister")
const { error, success } = require("../../service_response/userApiResponse")

// View all users profile 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await NewStarUser.find().select("-password")
        res.status(201).json(success(res.statusCode, "All Users fetched Successfully", users))
    } catch (err) {
        console.log(err);
        res.status(201).json(error("Error while fetching users", res.statusCode))
    }
}


// Approved users User Management -> Admin
exports.approvedUsers = async (req, res) => {
    // try {
    //     const approved = await NewStarUser.aggregate([{ $match: { "isVerified": "APPROVED" } }, { $project: { "password": 0 } }])
    //     // const { password, ...others } = pendings[0]
    //     // console.log(others);
    //     res.status(201).json(success(res.statusCode, "Approved Users", approved))
    // } catch (err) {
    //     console.log(err);
    //     res.status(401).json(error("Error while fetching pending users", res.statusCode))
    // }
    const { from, to } = req.body
    console.log(req.body);
    try {
        if (!from || !to) {
            const approved = await NewStarUser.aggregate([
                { $match: { "isVerified": "APPROVED" } },
                { $project: { "password": 0 } },
            ])
            console.log(approved);
            res.status(201).json(success(res.statusCode, "Approved Users", approved))
        } else {
            const approved = await NewStarUser.find({
                isVerified: "APPROVED",
                "createdAt": {
                    "$gte": (from),
                    "$lte": (to)
                }
            })
            console.log(approved);
            res.status(201).json(success(res.statusCode, "Pending Users", approved))
        }
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while fetching approved users", res.statusCode))
    }
}


// Pending users User Management -> Admin
exports.pendingUsers = async (req, res) => {
    const { from, to } = req.body
    console.log(req.body);
    try {
        if (!from || !to) {
            const pendings = await NewStarUser.aggregate([
                { $match: { "isVerified": "PENDING" } },
                { $project: { "password": 0 } },
            ])
            console.log(pendings);
            res.status(201).json(success(res.statusCode, "Pending Users", pendings))
        } else {
            const pendings = await NewStarUser.find({
                isVerified: "PENDING",
                "createdAt": {
                    "$gte": (from),
                    "$lte": (to)
                }
            })
            console.log(pendings);
            res.status(201).json(success(res.statusCode, "Pending Users", pendings))
        }
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while fetching pending users", res.statusCode))
    }
}




// Rejected users User Management -> Admin
exports.rejectedUsers = async (req, res) => {
    // try {
    //     const rejected = await NewStarUser.aggregate([{ $match: { "isVerified": "REJECTED" } }, { $project: { "password": 0 } }])
    //     res.status(201).json(success(res.statusCode, "Rejected Users", rejected))
    // } catch (err) {
    //     console.log(err);
    //     res.status(401).json(error("Error while fetching pending users", res.statusCode))
    // }
    const { from, to } = req.body
    console.log(req.body);
    try {
        if (!from || !to) {
            const rejected = await NewStarUser.aggregate([
                { $match: { "isVerified": "REJECTED" } },
                { $project: { "password": 0 } },
            ])
            console.log(rejected);
            res.status(201).json(success(res.statusCode, "Rejected Users", rejected))
        } else {
            const rejected = await NewStarUser.find({
                isVerified: "REJECTED",
                "createdAt": {
                    "$gte": (from),
                    "$lte": (to)
                }
            })
            console.log(rejected);
            res.status(201).json(success(res.statusCode, "Rejected Users", rejected))
        }
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while fetching pending users", res.statusCode))
    }
}


// Admin authorised user
exports.adminAuthorisedUser = async (req, res) => {
    try {
        const findUser = await NewStarUser.findByIdAndUpdate((req.params._id), {
            $set: req.body
        }, { new: true })
        res.status(201).json(success(res.statusCode, "User approved Successfully", { findUser }))
    } catch (err) {
        console.log(err);
        res.status(201).json(error("Error while authorising user", res.statusCode))
    }
}


// Get a User by Object _id -> admin
exports.getUser = async (req, res) => {
    try {
        const user = await NewStarUser.findById(req.params._id)
        res.status(201).json(success(res.statusCode, "User fetched Successfully", user))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while fetching user", res.statusCode))
    }
}


// Reject user due incomplete registration details -> Admin
exports.rejectUser = async (req, res) => {
    // const {} = req.body
    try {
        const findInDB = await NewStarUser.findById(req.params._id)
        const errorObj = {
            body: req.body
        }
        console.log(errorObj);
        findInDB.isVerified = "REJECTED";
        await findInDB.save()
        res.status(201).json(success(res.statusCode, `${findInDB.firstName} ${findInDB.lastName} is Rejected`, errorObj))
    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error in rejection", res.statusCode))
    }
}


// import Users from CSV file -> Admin
exports.importUsers = async (req, res) => {
    // console.log(req.files)
    const csvFilePath = req.files[0].path
    var userNameAndPassword = []
    try {
        const jsonArray = await csv().fromFile(csvFilePath)
        // console.log(jsonArray);
        jsonArray.forEach((jsonArray) => {
            // console.log(jsonArray);
            for (let key in jsonArray) {
                const randomPass = Math.floor(10000 + Math.random() * 90000)
                jsonArray["password"] = randomPass
            }
            // console.log({
            //     email: jsonArray.email,
            //     password: jsonArray.password
            // })
            userNameAndPassword.push({
                email: jsonArray.email,
                password: jsonArray.password
            })
        })
        try {
            const importedData = await NewStarUser.create(jsonArray)
            // console.log(importedData);
            res.status(201).json(success(res.statusCode, "Successfully Imported", { importedData, userNameAndPassword }))
        } catch (err) {
            console.log(err);
            res.status(401).json(error("Validation Error", res.statusCode))
        }

    } catch (err) {
        console.log(err);
        res.status(401).json(error("Error while importing the data", res.statusCode))
    }
}

