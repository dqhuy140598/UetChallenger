const mongoose = require('../config/database');
const Schema = mongoose.Schema;
const problemSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        require:true,
        trim:true
    },
    input:{
        type:String,
        trim:true
    },
    output:{
        type:String,
        require:true,
        trim:true,
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    created:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:Boolean,
        require:true
    },
    inexample:{
        type:String,
        trim:true,
    },
    outexample:{
        type:String,
        trim:true
    },
    testcase:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Test'
    }],
    tag:{
        type:Number,
        require:true
    }
});

const problem = mongoose.model('Problem',problemSchema);

module.exports = problem;