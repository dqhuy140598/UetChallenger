const mongoose = require('../config/database');

const submitSchema = mongoose.Schema({
    problem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Problem'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    score:{
        type:Number,
        require:true,
        default:0
    },
    completed:{
        type:Boolean,
        require:true,
        default:false,
    },
    created:{
        type:Date,
        default:Date.now()
    }
})

const submition = mongoose.model('Submition',submitSchema);

module.exports = submition;