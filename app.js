const express=require('express')
const app=express();
const Port=process.env.Port || 3100;
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const verify=require('./models/verifyToken')
const cron = require('node-cron');
const fs=require('fs')
const role=require('./models/role')
const User=require('./models/user')


var currentdate=new Date();
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds()+"\n";

            cron.schedule('* * * * *', () => {
                fs.appendFile('./a.txt',datetime,(err)=>{
                    if(err) return console.log(err);
                    else return console.log('sucess cron job')
                })
            });

mongoose.connect('mongodb+srv://rhino11:rhino11@cluster0.klzdx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

mongoose.connection.on('connected',connected=>{
    console.log("connect with database")
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

app.use('/signup',require('./routes/signup'))
app.use('/login',require('./routes/login'))

//private route access when token is verified
app.get('/',verify,(req,res)=>{
    res.send(req.user);
    
})
app.get('/admin',role("admin"),async (req,res)=>{
    await User.find().exec().then(data=>{
        res.status(200).json({
            alluser:data
        }
        )
    })
    //res.send(result);
    
})





app.listen(Port,()=>console.log(`server is running on ${Port}`))