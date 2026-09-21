require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
const profileRoutes = require("./routes/profile.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.send("Server is healthy")
})

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes)

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB")
})
.catch((err) => {
    console.log(err)
})
app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
})