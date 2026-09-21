const express = require("express");
const router = express.Router();
const Profile = require("../models/profile.js")
const auth = require("../middleware/auth.js");


//Get
router.get("/", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id});
        if(!profile){
            return res.status(404).json({message: "Profile not found"});
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
});

module.exports = router;