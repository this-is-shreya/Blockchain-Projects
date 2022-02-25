const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const details = new Schema({
first_name:{type:String},
last_name:{type:String},
email:{type:String},
account:{type:String},
marksheet_10:
{data:{type:Buffer},
contentType:{type:String}
},
marksheet_12:{data:{type:Buffer},
contentType:{type:String},},
identity:{data:{type:Buffer},
contentType:{type:String}}
})
module.exports = mongoose.model('details', details);
