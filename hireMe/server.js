var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.set("view engine","ejs")

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const dotenv = require("dotenv")
dotenv.config({path:"./config.env"})
const customid = require("custom-id")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const emp = require("./schema/employee")
mongoose.connect("mongodb://127.0.0.1:27017/mongo_practice",
  {useNewUrlParser:true,
 useUnifiedTopology:true })

 const Web3 = require("web3")
 const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
 const Abi = require("./build/contracts/hireMe.json")
 const contract = new web3.eth.Contract(Abi.abi,
   "CONTRACT ADDRESS")
  const cookieParser = require("cookie-parser")
  app.use(cookieParser());

app.get("/",(req,res)=>{
  res.render("index")
})
app.post("/send-verif-mail",async(req,res)=>{
  console.log(req.body.f_name)

let cid = customid({email:req.body.email,randomLength:2})
let data = new emp({
  email:req.body.email,
  code:cid
})
let doc = await data.save()
let str = "Your details are going to be added on blockchain, please go through them carefully as once added, it can't be changed.\n"
let str2 = "Name: "+req.body.f_name+" "+req.body.l_name+"\nExperience: "+req.body.role+" from "+req.body.year+" at "+req.body.company
  let transporter = nodemailer.createTransport({
     
    host: 'smtp.gmail.com',
   port: 587,
   secure:false,
   
   auth: {
     user: process.env.email,
     pass: process.env.password
   },
   tls:{
     rejectUnauthorized:false
   }
});
let mailOptions = {
   to: req.body.email,
   subject: "Adding details on Blockchain",
   text: str+str2+"\nCode: "+cid,
   html:""
};

transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
       return console.log(error);
   }
   else{
   console.log('Message %s sent: %s', info.messageId, info.response);
   res.cookie("name",req.body.f_name+" "+req.body.l_name)
res.cookie("role",req.body.role)
res.cookie("year",req.body.year)
res.cookie("company",req.body.company)
   res.redirect("/verify/"+doc._id)}
});
})
app.get("/verify/:id",(req,res)=>{
  res.render("verify",{id:req.params.id})
})
app.post("/code-verif",async(req,res)=>{
  let codee = await emp.findById(req.body.id)
  if(codee.code == req.body.code){
    let _name = req.cookies['name']
    let exp = req.cookies['role']+" from "+req.cookies['year']+" at "+req.cookies['company']
    console.log(_name,exp,codee.email)
    contract.methods.addEmp(_name,exp,codee.email).send(
      {from:"ACCOUNT ADDRESS",gas:3000000})
    await emp.deleteMany({email:codee.email})

    contract.methods.emp("shreyasrivastava28@gmail.com").call().then(
      console.log()
    ).catch(err=>console.log(err))

    res.clearCookie('name')
    res.clearCookie('role')
    res.clearCookie('year')
    res.render("verify2")

  }
  else{
    await emp.deleteMany({email:codee.email})

    // res.send("Wrong Code entered")

  }
})
app.get("/fetch",(req,res)=>{
  res.render("fetch")
})
app.post("/fetch-records",(req,res)=>{

  let email = req.body.email
 
  contract.methods.emp(email).call().then(data=>{
    res.render("displayRecords",{data:data})
  })
})
app.listen(3000,()=>{console.log("listening")})