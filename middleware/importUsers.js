const { success, error } = require("../service_response/userApiResponse")
const multer = require("multer")
const fs = require("fs")


function createImportFilePath(req, res, next) {
    // console.log(req.body);
    fs.exists("./public/csvFile", function (exist) {
        if (exist) {
            next()
        } else {
            fs.mkdir("./public/csvFile", { recursive: true }, function (err) {
                if (err) {
                    console.log("Error in file creation");
                    next()
                }
                next()
            })
        }
    })
}

const storageDisk = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "public/csvFile")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    }
})

const CSVFileUpload = multer({
    storage: storageDisk,
    fileFilter: (req, file, cb) => {
        cb(null, true)
    }
});

module.exports = {CSVFileUpload,createImportFilePath};