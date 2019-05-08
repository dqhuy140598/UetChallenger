const mongoose = require('../config/database')
const Schema  = mongoose.Schema;
const categorySchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    image:{
        type:String,
    },
    status:{
        type:Boolean,
        require:true
    },
    created:{
        type:Date,
        default:Date.now()
    },
    problems:[{
        type:Schema.Types.ObjectId,
        ref:'Problem'
    }]
})

const category = mongoose.model('Category',categorySchema)

module.exports = category