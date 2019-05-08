const Test = require('../models/testcase');

const Problem = require('../models/problem');

addTest = async (req,res)=>{

    console.log(req.files);
 
    const numOfTest = 2;

    const id = req.params.id;

    let filePathIn = [];
    let filePathOut = [];

    if(req.files.in!=null || req.files.out!=null){
        if(req.files.in!=null){
            filePathIn = req.files.in.map((file)=>{
                return file.path.toString();
            })
        }
        if(req.files.out!=null){
            filePathOut = req.files.out.map((file)=>{
                return file.path.toString();
            })
        }
        if(filePathIn.length>0){
            req.body.test = filePathIn;
        }
        if(filePathOut.length>0){
            req.body.test = filePathOut;
        }
        
        if(filePathIn.length<2 && filePathIn.length>0){
            req.body.test = filePathIn[0];
         }
        if(filePathOut.length<2 && filePathOut.length>0){
             req.body.test = filePathOut[0];
         }
        req.body.testlength = filePathIn.length || filePathOut.length;
           
    }
    
    req.checkBody('test','Test Case Không Thể Để Trống').notEmpty();
    req.checkBody('test','Phải Thêm Đủ Test Case').isArray();

    const error = req.validationErrors();

    if(error){
        req.flash('error',error[0].msg);
        res.status(400).redirect('/admin/addtest/'+id);
    }
    else{
        const testPathIn = filePathIn.map((path)=>{
            const temp = path.split('\\');
        
            temp.shift();
        
            let solutionPath = '';
        
            temp.forEach(element => {
                solutionPath = solutionPath +'/'+element    
            });
            
            return solutionPath;
        })

        const testPathOut = filePathOut.map((path)=>{
            const temp = path.split('\\');
        
            temp.shift();
        
            let solutionPath = '';
        
            temp.forEach(element => {
                solutionPath = solutionPath +'/'+element    
            });
            
            return solutionPath;
        })
        

        try{
            for(var i=0;i<testPathIn.length;i++){
                const test = new Test({
                    input:testPathIn[i],
                    output:testPathOut[i],
                    problem:id
                })
                const res = await test.save();
                const problem = await Problem.findById({_id:id});
                problem.testcase.push(res._id);
                const final = await problem.save();
            }
            res.status(200).redirect('/admin/listtest');
        }
        catch(err){
            console.log(err);
        }
    }
   
}

module.exports = {
    addTest:addTest
}