const mongoose = require("mongoose")
const emp =new mongoose.Schema({
email:{type:String},
code:{type:String}
})
module.exports = mongoose.model("emp",emp)