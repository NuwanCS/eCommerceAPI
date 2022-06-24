const User = require("../models/User");

const router = require("express").Router();
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//Register

router.post("/register",async (req, res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    })

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
        //201 - successfully added
    }catch(err){
        res.status(500).json(err)
    }
    //save user to DB
    

})


//Login

router.post("/login",async (req,res)=>{

    try{

        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("Wrong credentials");

        const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const passwordOriginal = hashPassword.toString(CryptoJS.enc.Utf8);

        passwordOriginal !== req.body.password && res.status(401).json("Wrong credentials");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, 
        process.env.JWT_SEC,
        {expiresIn:"30d"}
        )


        //To prevent showing the password in any request
        const { password , ...others } = user._doc;
        res.status(200).json({...others, accessToken});
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;