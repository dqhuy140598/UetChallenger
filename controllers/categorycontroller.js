const Category = require('../models/category')

addCategory = (req,res)=>{
    const name = req.body.name;
    const status = req.body.status;

    req.checkbody('name')
}