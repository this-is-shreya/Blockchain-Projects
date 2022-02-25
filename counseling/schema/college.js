const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const college = new Schema({
first_name:{type:String},
last_name:{type:String},
email:{type:String},
account:{type:String},
cid:{type:String},
photo:{data:{type:Buffer},
contentType:{type:String}},
marksheet_10:
{
type:String
},
marksheet_12:{
type:String,},
identity:{
type:String}
})
module.exports = mongoose.model('college', college);
