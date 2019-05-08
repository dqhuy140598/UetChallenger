const mongooes = require('../config/database');

const testSchema = mongooes.Schema({
    input:{
        type:String,
        trim:true,
        require:true
    },
    output:{
        type:String,
        require:true,
        trim:true
    },
    problem:{
        type:mongooes.Schema.Types.ObjectId,
        ref:'Problem'
    }
});

const test = mongooes.model('Test',testSchema);

module.exports = test;