const { success, error } = require("../service_response/userApiResponse")
const multer = require("multer")

const storageDisk = multer.diskStorage({
    destination : (req,res,cb)=>{
        cb(null,"public/images")
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + "--" + file.originalname)
    }
})

const upload = multer({storage:storageDisk,
    fileFilter: (req,file,cb)=>{
        if(file.mimetype == "image/jpg"||file.mimetype == "image/jpeg"||file.mimetype == "image/png"){
            cb(null,true)
        }else{
            cb(null,false);
            return cb(new Error("Only .png .jpg and .png file allowed"));
        }
    },
    // limits:{fileSize:5000}
});

module.exports = upload;