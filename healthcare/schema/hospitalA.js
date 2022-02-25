const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const A = new Schema({
email:{type:String},

add_verif:{type:String},
fetch_verif:{type:String},

})
module.exports = mongoose.model('A', A);
