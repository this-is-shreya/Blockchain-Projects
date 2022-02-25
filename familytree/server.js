const express = require("express")
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
const path = require("path")
app.use(express.static(path.join(__dirname, "/public")));

app.set("view engine","ejs")
const fu = require("express-fileupload")
app.use(fu())
const md5 = require("md5")
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
const Abi = require("./build/contracts/familytree.json").abi
const contract = new web3.eth.Contract(Abi,
    "0x7A7329080bbbF40552554EF62b79aA17391d2dA7")
const defaultAccount = "0x0cba42C6fE09405A920A238F93Dd55278F2a0Edc"

app.get("/add-details",(req,res)=>{
    res.render("index")
})
app.post("/save-details",(req,res)=>{
let doc = req.files.identity
console.log(doc.mimetype)
if(doc.mimetype == "application/pdf"){
    const data = md5(doc.data)
    contract.methods.addPerson(req.body.account,data,req.body.first +" "+req.body.last).send({
        from:defaultAccount,
        gas:3000000
    })
    res.render("successful")
}
else{
    res.send("wrong document")
}
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register-details",(req,res)=>{
    console.log("entered here")
    console.log(req.body.f_account)
contract.methods.makeConnection(req.body.account,req.body.f_account,req.body.m_account).send({
    from:defaultAccount,
    gas:3000000
})

res.send("added")
})
app.get("/successful",(req,res)=>{
    res.render("successful")
})
app.post("/check-details",(req,res)=>{
    contract.methods.person_identity(req.body.account).call().then(data=>{
        if(data == md5(req.files.identity.data)){
            res.send("y")
        }
        else{
            res.send("n")
        }
    })
   
   
  
})
app.post("/check-father",(req,res)=>{
    contract.methods.person_identity(req.body.f_account).call().then(data=>{
        if(data == md5(req.files.f_identity.data)){
           res.send("y")
        }
        else{
            res.send("n")
        }
    })
})
app.post("/check-mother",(req,res)=>{
    contract.methods.person_identity(req.body.m_account).call().then(data=>{
        if(data == md5(req.files.m_identity.data)){
           res.send("y")
        }
        else{
            res.send("n")
        }
    })
})
app.get("/nodes",(req,res)=>{
    contract.methods.getAll().call().then(data=>{
        res.send(data)
    })
    
})
app.get("/tree",(req,res)=>{
res.render("tree")
})
app.get("/get-connection",async(req,res)=>{
    
let mapObject = new Map()
let mapObject2 = new Map()
let arr = await contract.methods.getAll().call()
for(let i=0;i<arr.length;i++){
    await contract.methods.connection(arr[i]).call().then(data=>{
        mapObject.set(arr[i],data)
        
    })
}
for(let i=0;i<arr.length;i++){
    await contract.methods.person_name(arr[i]).call().then(data=>{
        mapObject2.set(arr[i],data)
        
    })
}
// console.log([...mapObject2.entries()])
res.send({all:[...mapObject.entries()],names:[...mapObject2.entries()]})
        
    
})
app.listen(3000,()=>{
    console.log("listening at 3000")
})