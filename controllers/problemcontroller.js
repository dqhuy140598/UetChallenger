const Problem = require('../models/problem')
const Category = require('../models/category')

addProblem = async (req,res,error)=>{

    const category = req.body.category;
    const name = req.body.name;
    const description = req.body.description;
    const input = req.body.input;
    const output = req.body.output;
    const status = (req.body.status==1)?1:0;
    const inexample = req.body.inexample;
    const outexample = req.body.outexample;
    const tag = req.body.tag;
   
    req.checkBody('name','Tên Không Thể Để Trống').notEmpty();
    req.checkBody('output','Đầu Ra Không Thể Để Trống').notEmpty();
    req.checkBody('description','Mô Tả Không Thể Để Trống').notEmpty();
    req.checkBody('inexample','Đầu Vào Mẫu Không Thể Bỏ Trống').notEmpty();
    req.checkBody('outexample','Đầu Ra Mẫu Không Thể Bỏ Trống').notEmpty();
    const err = req.validationErrors();

    if(err){
        req.flash('error',err[0].msg);
        res.status(400).redirect('/admin/addproblem');
    }
    else{
        const problem = Problem({
            category:category,
            name:name,
            description:description,
            input:input,
            output:output,
            status:status,
            inexample:inexample,
            outexample:outexample,
            tag:tag
        });
        try{
            const result = await problem.save();
            const tag = await Category.findById({_id:category})
            tag.problems.push(result._id);
            const temp = await tag.save();
            res.status(200).redirect('/admin/listproblem');
        }
        catch(err){
            console.log(err);
        }
    }  
}

getListProblem = async (req,res)=>{
    try{
        const listproblem = await Problem.find({}).populate('category','name');
        res.render('listproblem',{listproblem});
    }
    catch(err){
        console.log(err);
    }
}

getEditProblem = async(req,res)=>{
    const id = req.params.id;
    const err = req.flash('error');
    try{
        const editproblem = await Problem.findById({_id:id.toString()}).populate('category','name');
        const temp = await Category.find({})
        const listcategory = temp.filter((category)=>{
            return category.name !== editproblem.category.name;
        }) 
        console.log(listcategory);
        res.render('editproblem',{editproblem,listcategory,err});
    }
    catch(err){
        console.log(err);
    }
}

updateProblem = async(req,res)=>{

    console.log(req.body)

    const id = req.params.id;

    const category = req.body.category;
    const name = req.body.name;
    const description = req.body.description;
    const input = req.body.input;
    const output = req.body.output;
    const status = (req.body.status==1)?1:0;
    const inexample = req.body.inexample;
    const outexample = req.body.outexample;
    const tag = req.body.tag;
    let filePath = '';

    /*
    if(req.file){
         filePath = req.file.path.toString()
         req.body.solution = filePath
    }
    const temp = filePath.split('\\');
    
    temp.shift();

    let solutionPath = '';

    temp.forEach(element => {
        solutionPath = solutionPath +'/'+element    
    });
    */
    req.checkBody('name','Tên Không Thể Để Trống').notEmpty();
    req.checkBody('output','Đầu Ra Không Thể Để Trống').notEmpty();
    req.checkBody('description','Mô Tả Không Thể Để Trống').notEmpty();
    req.checkBody('inexample','Đầu Vào Mẫu Không Thể Bỏ Trống').notEmpty();
    req.checkBody('outexample','Đầu Ra Mẫu Không Thể Bỏ Trống').notEmpty();
    const err = req.validationErrors();

    if(err){
        console.log(err);
        req.flash('error',err[0].msg);
        res.status(400).redirect('/admin/editproblem/'+id);
    }
    else{
        const problem = {
            category:category,
            name:name,
            description:description,
            input:input,
            output:output,
            status:status,
            solution:solutionPath,
            inexample:inexample,
            outexample:outexample,
            tag:tag
        };
        try{
            const result = await Problem.findByIdAndUpdate({_id:id.toString()},{$set:problem});
            res.status(200).redirect('/admin/listproblem');
        }
        catch(err){
            console.log(err);
        }
    }   
}

deleteProblem = async(req,res)=>{
    const id = req.params.id;
    try{
        const result = await Problem.findByIdAndDelete({_id:id.toString()});
        res.status(200).redirect('/admin/listproblem');
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    addProblem:addProblem,
    getListProblem:getListProblem,
    getEditProblem:getEditProblem,
    updateProblem:updateProblem,
    deleteProblem:deleteProblem
}
