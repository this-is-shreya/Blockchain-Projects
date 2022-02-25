const md5 = require("md5") //used for hashing
const express = require("express")
const app = express()
const path = require("path")
app.use(express.static(path.join(__dirname, "/public")));
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
const fu = require("express-fileupload")
app.use(fu())
const customId = require("custom-id")
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
const Abi = require("./build/contracts/counseling.json")
const contract = new web3.eth.Contract(Abi.abi,
  "")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const details = require("./schema/details")
const college = require("./schema/college")
mongoose.connect("mongodb://127.0.0.1:27017/mongo_practice",
  {useNewUrlParser:true,
 useUnifiedTopology:true })
app.set("view engine","ejs")



app.get("/add-details",(req,res)=>{
  res.render("index")
})
app.post("/save-details",async(req,res)=>{
  console.log("entered here")
  if(req.files == null || req.files == undefined){
    console.log("empty")
    console.log(req.files)
  }
else{

  let marksheet_10 = req.files.marksheet_10
  let marksheet_12 = req.files.marksheet_12
  let identity = req.files.identity
console.log(marksheet_12.mimetype)
  if(marksheet_12.mimetype == "image/jpeg" || marksheet_12.mimetype == "image/png" || marksheet_12.mimetype == "image/jpg"){
    console.log("entered here2")
  
    let s = req.files.marksheet_12.data
    let base64 = s.toString('base64');
    image_12 = Buffer.from(base64, 'base64');
// console.log(base64)
let s2 = req.files.marksheet_10.data
let base64_10 = s2.toString('base64');
image_10 = Buffer.from(base64_10, 'base64');

let s3 = req.files.identity.data
let base64_i = s3.toString('base64');
image_i = Buffer.from(base64_i, 'base64');
   //  console.log(base64.substr(0,200));
  //  console.log(image_i)
   if(marksheet_10.mimetype == "image/jpeg" ||marksheet_10.mimetype == "image/png" || marksheet_10.mimetype == "image/jpg"){
    
   if(identity.mimetype == "image/jpeg" ||identity.mimetype == "image/png" || identity.mimetype == "image/jpg"){
    
    const data = new details({
      first_name:req.body.first,
      last_name:req.body.last,
      email:req.body.email,
      account:req.body.account,
      marksheet_12:{
        data:image_12,
        contentType:marksheet_12.mimetype
      },
      marksheet_10:{
        data:image_10,
        contentType:marksheet_10.mimetype
      },
      identity:{
        data:image_i,
        contentType:identity.mimetype
      }
        })
        await data.save()
        console.log("done")
        res.redirect("/display")
      }
  }
}
  
}
})
app.get("/display",async(req,res)=>{
  await details.find().sort({_id:-1}).then(data=>{
    let marksheet_10 = data[0].marksheet_10.data.toString("base64")
    let marksheet_12 = data[0].marksheet_12.data.toString("base64")
    let identity = data[0].identity.data.toString("base64")
    res.render("displaydocs",{data:data[0],marksheet_12:marksheet_12,marksheet_10:marksheet_10,
    identity:identity})
  
    let md_10 = md5(marksheet_10)
    let md_12 = md5(marksheet_12)
  let md_i = md5(identity)
  
let defaultAccount =""
  contract.methods.addStudent(data[0].account+"_10",md_10).send({from:defaultAccount})
  contract.methods.addStudent(data[0].account+"_12",md_12).send({from:defaultAccount})
  contract.methods.addStudent(data[0].account+"_i",md_i).send({from:defaultAccount})
  })
 

})
app.get("/apply",async(req,res)=>{
  res.render("apply",{verif_12:""})
})

app.post("/save-details-12",async(req,res)=>{
  let arr=[];
  let str_result ="";
  //for 12
  let s3 = req.files.marksheet_12.data
let base64_12 = s3.toString('base64');
let image_12 = Buffer.from(base64_12, 'base64');
  let m_12 = image_12.toString("base64")
  let md_12 = md5(m_12)
  contract.methods.student(req.body.account+"_12").call().then(data=>{
    if(data == md_12){
      arr.push("v")
      str_result += "v"
    console.log("matched_12")
    }
    else{
      str_result += "n"

      arr.push("n")
    }
    res.send(str_result)

      })
  

})
app.post("/save-details-10",(req,res)=>{
  let str_result=""

  let s4 = req.files.marksheet_10.data
  let base64_10 = s4.toString('base64');
let image_10 = Buffer.from(base64_10, 'base64');
  let m_10 = image_10.toString("base64")
  let md_10 = md5(m_10)
  contract.methods.student(req.body.account+"_10").call().then(data=>{
if(data == md_10){
    console.log("matched_10")
    str_result += "v"

    }
    else{
      str_result += "n"

    }
    res.send(str_result)


  })
})
app.post("/save-details-identity",(req,res)=>{
  let str_result=""
  let s5 = req.files.identity.data
  let base64_i = s5.toString('base64');
let image_i = Buffer.from(base64_i, 'base64');
  let m_i = image_i.toString("base64")
  let md_i = md5(m_i)
  contract.methods.student(req.body.account+"_i").call().then(data=>{
if(data == md_i){
  console.log("matched_i")
  str_result += "v"

  }
  else{
    str_result += "n"
    
  
  }
  res.send(str_result)

  })
 
})
app.post("/registration",async(req,res)=>{
  let photo = req.files.photo

  if(photo.mimetype == "image/jpeg" || photo.mimetype == "image/png" || photo.mimetype == "image/jpg"){
        
      
        let s = req.files.photo.data
        let base64 = s.toString('base64');
        image_photo = Buffer.from(base64, 'base64');
      
      const data = new college({
        first_name:req.body.first,
        last_name:req.body.last,
        email:req.body.email,
        account:req.body.account,
        marksheet_12:"v",
        marksheet_10:"v",
        identity:"v",
        photo:{
          data:image_photo,
            contentType:photo.mimetype
        }
          })
         let doc = await data.save()
         let cid = customId({id:doc._id,randomLength:4})
         console.log(cid)
        await college.findByIdAndUpdate({_id:doc._id},{
          $set:{
            cid:cid
          }
        })
          let transporter = nodemailer.createTransport({
     
            host: '',
           port: "",
           secure:false,
           
           auth: {
             user: "Enter the email",
             pass: "and it's password"
           },
           tls:{
             rejectUnauthorized:false
           }
       });
       let mailOptions = {
           to: req.body.email,
           subject: "Confirmation of Registration",
           text: "Your registration is confirmed, all you have to do is share your code with the officials at college for verification.\nYour code is "+cid,
           html:""
       };
       
       transporter.sendMail(mailOptions, (error, info) => {
           if (error) {
               return console.log(error);
           }
           else{
           console.log('Message %s sent: %s', info.messageId, info.response);
           res.send("done")}
       });
    }
})
app.get("/success",(req,res)=>{
  res.render("college",{msg:"done"})
})
app.get("/admin",async(req,res)=>{
  res.render("admin")
})
app.post("/get-student",async(req,res)=>{
  await college.find({cid:req.body.code}).then(data2=>{
    res.send({data:data2,img:data2[0].photo.data.toString("base64")})
  })
})
app.listen(3000, ()=>console.log("listening at 3000"))
