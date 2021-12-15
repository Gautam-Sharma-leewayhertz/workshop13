const router=require('express').Router();
const {loginValidation}=require('../models/validation');
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const User=require('../models/user')
const jwt=require('jsonwebtoken')

router.post('/',async (req,res)=>{

    //lets validate the data before we a user
    const validation=loginValidation(req.body)
    
    if(validation.error) return res.status(400)
    .send(validation.error.details[0].message)

    //checking if user is already in database
    const user=await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send('email not found')
    
    //PASSWORD is CORRECT
    const validpassword=await bcrypt.compare(req.body.password,user.password)
    if(!validpassword) return res.status(400).send('Invalid password')

    //create and assign a token
    const token=jwt.sign({_id:user._id},'gautam123')
    res.header('auth-token',token).status(200).json({
        user:user._id,
        token:token
    })

})
module.exports=router