const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const User = require("../models/user.js");
const Profile = require("../models/profile.js");

router.post("/register", async (req, res) => {
    const {name,email,password} = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();


        const profile = new Profile({
            user: user._id,
            bio: "",
            phone: "",
            gender: "",
            dob: "",
            avatar: "",
            location: ""
        });
        await profile.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN, {expiresIn: "1d"});

        res.status(201).json({
            token,
            user
        })
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});

router.post("/login", async (req,res) => {
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "Email not found"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({
            message: "Invalid credential"
        })
    }

    const existingProfile = await Profile.findOne({user: user._id});
    if(!existingProfile){
        const profile = new Profile({
            user: user._id,
            bio: "",
            phone: "",
            gender: "",
            dob: "",
            avatar: "",
            location: ""
        });
        await profile.save();
    }

    const token = jwt.sign(
        {
            id: user._id,
            isHost: user.isHost
        },
        process.env.JWT_TOKEN,
        {
            expiresIn: "1d"
        }
    );

    res.json({
        user: {
            id: user._id,
            name: user.name,
            isHost: user.isHost
        }
    })
})

module.exports = router;