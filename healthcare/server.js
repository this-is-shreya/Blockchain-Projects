const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
const ObjectId = require('mongodb').ObjectID;

const path = require("path")

app.use(express.static(path.join(__dirname, "/public")));
const fu = require("express-fileupload")
app.use(fu())
const dotenv = require("dotenv")
dotenv.config({path:"./config.env"})

const customId = require("custom-id")
const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/mongo_practice",
  {useNewUrlParser:true,
 useUnifiedTopology:true })
 const h_A = require("./schema/hospitalA")
 const h_B = require("./schema/hospitalB")
const nodemailer = require("nodemailer")
var ipfsAPI = require('ipfs-http-client')
var ipfs = ipfsAPI.create({host: 'ipfs.infura.io', port: '5001', protocol:'https'})

const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
const Abi = require("./build/contracts/healthcare.json").abi
const contract = new web3.eth.Contract(Abi,process.env.CONTRACT)
const defaultAccount = process.env.DEFAULT


const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const filesAdded = await ipfs.add({ path: fileName, content: file }, {
  progress: (len) => console.log("Uploading file..." + len)
});
  console.log(filesAdded);
  const fileHash = filesAdded.cid.toString();
  fs.unlink(path.join(__dirname+"/upload/"+fileName),()=>{
           console.log("deleted")
         })
  return fileHash;
};

app.set("view engine","ejs")

app.get("/",(req,res)=>{
  res.render("index")
})
app.get("/hospitalA",(req,res)=>{
  res.render("dashboardA")
})
app.get("/hospitalB",(req,res)=>{
  res.render("dashboardB")
})
app.get("/hospitalA/admin",(req,res)=>{
  res.render("adminA")
})
app.get("/hospitalB/admin",(req,res)=>{
  res.render("adminB")
})

//POST ROUTES
app.post("/ipfs",async(req,res)=>{

let cid = customId({data:req.files.report.data,randomLength:1})
let docA;
let docB;
if(req.body.dashboard == "A"){
 docA = await h_A.findOne({email:req.body.email})
  if(docA == null ){
  const data = new h_A({
  email:req.body.email,
  add_verif:cid
  })
  docA = await data.save()
  }
  else{
  await h_A.findByIdAndUpdate(docA._id,{
  $set:{
    add_verif:cid
  }
  })
  }
}
else{
 docB = await h_B.findOne({email:req.body.email})
// console.log(doc)
if(docB == null ){
const data = new h_B({
email:req.body.email,
add_verif:cid
})
docB = await data.save()
}
else{
await h_B.findByIdAndUpdate(docB._id,{
$set:{
  add_verif:cid
}
})
}
}
 if(req.body.dashboard == "A"){
  req.files.report.name = docA._id+".jpg"

 }
 else{
  req.files.report.name = docB._id+".jpg"

 }

console.log(req.files.report)
req.files.report.mv(path.join(__dirname+'/upload/'+req.files.report.name))

let transporter = nodemailer.createTransport({
     
  host: 'smtp.gmail.com',
 port: 587,
 secure:false,
 
 auth: {
   user: process.env.EMAIL,
   pass: process.env.PASSWORD
 },
 tls:{
   rejectUnauthorized:false
 }
});
let mailOptions = {
 to: req.body.email,
 subject: "Your Medical Report",
 text: "You can find your medical report attached with this mail. If the report is yours, please share the verification code with the officials at the hospital.\nVerification Code: "+cid,
 html:"",
 attachments: [{
  filename: req.files.report.name,
  path: path.join(__dirname+'/upload/'+req.files.report.name),
  contentType: 'image/png'
}],
};

transporter.sendMail(mailOptions, (error, info) => {
 if (error) {
     return console.log(error);
 }
 else{
 console.log('Message %s sent: %s', info.messageId, info.response);
 
 
}
});
if(req.body.dashboard == "A"){
  res.redirect("/add-verif-A/"+docA._id)

}
else{
res.redirect("/add-verif-B/"+docB._id)

}
})
app.get("/add-verif-A/:id",async(req,res)=>{
  const emaill = await h_A.findById(req.params.id)
res.render("add_verif_A",{email:emaill.email})
})
app.get("/add-verif-B/:id",async(req,res)=>{
  const emaill = await h_B.findById(ObjectId(req.params.id))
  res.render("add_verif_B",{email:emaill.email})
  })
app.post("/add-verif-post",async(req,res)=>{
  let doc;
  if(req.body.dashboard == "A"){
    doc = await h_A.findOne({email:req.body.email})

    if(doc.add_verif == req.body.verif){
      
    let fileName = doc._id+".jpg"
    console.log(fileName)
     const filePath = __dirname+"/upload/"+doc._id+".jpg"
      console.log(filePath)
     const cid = await addFile(fileName, filePath);
    //  let email = doc[0].email
    
     contract.methods.addRecords(req.body.email,cid).send({from:defaultAccount,gas:3000000})
    
      
      res.send("Added to IPFS")
    }
  }
else{
  doc = await h_B.findOne({email:req.body.email})
if(doc != null && doc.add_verif == req.body.verif){
  
let fileName = doc._id+".jpg"
console.log(fileName)
 const filePath = __dirname+"/upload/"+doc._id+".jpg"
  console.log(filePath)
 const cid = await addFile(fileName, filePath);

 contract.methods.addRecords(req.body.email,cid).send({from:defaultAccount,gas:3000000})

  
  res.send("Added to IPFS")
}

}

})
app.post("/fetch", async(req,res)=>{
  let cid = customId({email:req.body.email,randomLength:1})
let doc;
if(req.body.dashboard == "A"){
  doc = await h_A.findOne({email:req.body.email})
  // console.log(doc)
  if(doc != null ){
    await h_A.findByIdAndUpdate(doc._id,{
      $set:{
        fetch_verif:cid
      }
      })
  }
  else{
    const data = new h_A({
      email:req.body.email,
      fetch_verif:cid
    })
    await data.save()
  }
}
else{
  doc = await h_B.findOne({email:req.body.email})
  if(doc != null ){
    await h_B.findByIdAndUpdate(doc._id,{
      $set:{
        fetch_verif:cid
      }
      })
  }
  else{
    const data = new h_B({
      email:req.body.email,
      fetch_verif:cid
    })
    await data.save()
  }
}

  let transporter = nodemailer.createTransport({
     
    host: 'smtp.gmail.com',
   port: 587,
   secure:false,
   
   auth: {
     user: process.env.EMAIL,
     pass: process.env.PASSWORD
   },
   tls:{
     rejectUnauthorized:false
   }
  });
  let mailOptions = {
   to: req.body.email,
   subject: "Accessing your Medical Report?",
   text: "Enter the verification code below to access all your reports.\nVerification code:"+cid,
   html:"",
   
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
       return console.log(error);
   }
   else{
   console.log('Message %s sent: %s', info.messageId, info.response);
   
   
  }
  });

  if(req.body.dashboard == "A"){
    res.render("verif_fetch_A",{data:req.body.dashboard,email:req.body.email})

  }
  else{
    res.render("verif_fetch_B",{data:req.body.dashboard,email:req.body.email})

  }
  
 
})
app.post("/fetch-verif-post",async(req,res)=>{
  if(req.body.dashboard == "A"){

  
let doc = await h_A.findOne({email:req.body.email})

  if(doc.fetch_verif == req.body.verif){
    contract.methods.records(req.body.email).call().then(data=>{
      const splitArray = data.split(",")
  
      res.render("fetch",{data:splitArray})
    })
  }
}
  else{
    doc = await h_B.findOne({email:req.body.email})
    if(doc.fetch_verif == req.body.verif){
      contract.methods.records(req.body.email).call().then(data=>{
        const splitArray = data.split(",")
        res.render("fetch",{data:splitArray})
      })
    }
      }
})
app.listen(3000,()=>{
    console.log("listening")
})