const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cnpm2',{useNewUrlParser:true,useCreateIndex:true},(err)=>{
    console.log(err);
})

module.exports = mongoose;