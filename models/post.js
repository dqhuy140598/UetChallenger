const mongoose = require('../config/database');

const postSchema = mongoose.Schema({
    title:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    image:{
        type:String,
    },
    content:{
        type:String,
        require:true,
        trim:true
    },
    created:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:Boolean,
        require:true,
        default:false
    }
})

const post = mongoose.model('Post',postSchema);

module.exports = post;