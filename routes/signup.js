const router=require('express').Router();
const {registerValidation}=require('../models/validation');
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const User=require('../models/user')
const jwt=require('jsonwebtoken')

router.post('/',async (req,res)=>{

    //lets validate the data before we a user
    const validation=registerValidation(req.body)
    
    if(validation.error) return res.status(400)
    .send(validation.error.details[0].message)

    //checking if user is already in database
    const emailexist=await User.findOne({email:req.body.email})
    if(emailexist) return res.status(400).send('email already exists')
    
    //hash the password
    const salt=await bcrypt.genSalt(10);
    const hashpassword=await bcrypt.hash(req.body.password,salt);


    //create a new user
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashpassword,
    });

    try{
        const savedUser=await user.save()
        res.send(savedUser)
    }
    catch(err){
        res.status(400).json({
            errName:err
        });
    }

    // res.status(200).json({
    //     name:req.body.name,
    //     email:req.body.email,
    //     password:req.body.password,
    // })
})


module.exports=router;