require("dotenv").config();
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors");
const cookieParser = require("cookie-parser")

const app = express()




require("./db/conn")
const NewStarUser = require("./models/register")
const port = process.env.PORT || 7000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())



app.get("/", (req, res) => {
    res.status(201).send("Welcome to Home Page")
})

app.post("/register", async (req, res) => {
    try {
        // console.log(req.body);

            const hashedPass = await bcrypt.hash(req.body.password,10)

        const newuser = new NewStarUser({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPass
        })
        const registerd = await newuser.save()
        res.status(201).send({
            error: false,
            error_code: 201,
            message: "Registered Sucessfully",
            results: registerd
        })

    } catch (err) {
        console.log(err);
        res.status(401).send({
            error: true,
            error_code: 401,
            message: "Wrong Input",
            // results: registerd
        })
    }
})


app.post("/login", async (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;
        const verifyUser = await NewStarUser.findOne({ email: email })

        const token = await verifyUser.generateAuthToken()
        
        res.cookie("jwt",token,{
            expires: new Date(Date.now() + (10*60000))
        })

        const isPasswordMatched = bcrypt.compare(password, verifyUser.password)
        if (isPasswordMatched) {
            res.status(201).send({
                error: true,
                error_code: 401,
                message: "Logged In",
                results: verifyUser
            })
        } else {
            res.status(201).send({
                error: true,
                error_code: 401,
                message: "Wrong Input",
                // results: registerd
            })
        }

    } catch (err) {
        console.log(err);
        res.status(401).send({
            error: true,
            error_code: 401,
            message: "Wrong Credential",
            // results: registerd
        })
    }
})






app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
})