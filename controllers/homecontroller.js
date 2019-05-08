const Category = require('../models/category');
const Problem = require('../models/problem');

renderHome = async(req,res)=>{
    let user = null;
    if(req.user){
        user = req.user;
    }
    try{
        const listproblem = await Problem.find({}).populate('category','name');
        const listcategory = await Category.find({});
        res.render('index',{listcategory,listproblem,user:user});
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    renderHome:renderHome
}