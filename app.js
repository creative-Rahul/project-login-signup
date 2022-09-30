require("dotenv").config();
const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const compression = require("compression")

const app = express()

require("./config/conn")

const port = process.env.PORT || 7000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(compression())

const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes")

app.use("/user", userRoutes)

app.use("/api/admin", adminRoutes);


app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
})