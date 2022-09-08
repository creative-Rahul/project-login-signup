require("dotenv").config();
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors");
const cookieParser = require("cookie-parser")

const app = express()

require("./config/conn")

const port = process.env.PORT || 7000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

const user = require("./routes/user")

app.use("/",user)







app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
})