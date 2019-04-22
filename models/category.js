const mongoose = require('../config/database')

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
    }
})

const category = mongoose.model(categorySchema)

module.exports = category