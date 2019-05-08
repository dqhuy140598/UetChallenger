const Category = require('../models/category');
const Problem = require('../models/problem');
const request = require('request');
const fs = require('fs');
const Submition = require('../models/submition');

const mongoose = require('../config/database');
const User = require('../models/user');

renderCategories = async(req,res)=>{
    let user = null;
    if(req.user){
        user = req.user;
    }
    try{
        const listproblem = await Problem.find({}).populate('category','name');
        const listcategory = await Category.find({});
        res.render('categories',{listcategory,listproblem,user:user});
    }
    catch(err){
        console.log(err);
    }
}

renderProblemsByCategoryId = async (req,res)=>{
    let user = null;
    if(req.user){
        user = req.user;
    }
    const userid = req.user._id;
    const id = req.params.id.toString();
    const categoryById = await Category.findById({_id:id}).populate('problems');
    const listproblembycategory = categoryById.problems;
    const categoryname = categoryById.name
    const listsubmition = await getListHighestSubmition(listproblembycategory,userid);
    const listsub = [];
    const wallOfFrame = await getWallOfFrame();
    for(var i = 0;i<listsubmition.length;i++){
        listsub.push(await listsubmition[i]);
    }
    for(var i = 0;i<listproblembycategory.length;i++){
        if(listsub[i]!=null){
            listproblembycategory[i].submition = listsub[i];
        }
        else {
            listproblembycategory[i].submition = null;
        }
    }
    res.render('problembycategory',{user:user,listproblembycategory,categoryname,wallOfFrame});
}

renderProblemsByTagId = async(req,res)=>{
    let user = null;
    if(req.user){
        user = req.user;
    }
    const wallOfFrame = await getWallOfFrame();
    
    const userid = req.user._id;
    const tagArr = ['Dễ','Trung Bình','Khó','Rất Khó'];
    const id = req.params.id;
    const listproblemsbytag = await Problem.find({tag:id.toString()});
    const tag = tagArr[id-1];
    const listsubmition = await getListHighestSubmition(listproblemsbytag ,userid);

    const listsub = [];
    for(var i = 0;i<listsubmition.length;i++){
        listsub.push(await listsubmition[i]);
    }
    for(var i = 0;i<listproblemsbytag.length;i++){
        if(listsub[i]!=null){
            listproblemsbytag[i].submition = listsub[i];
        }
        else {
            listproblemsbytag[i].submition = null;
        }
    }
    res.render('problembytag',{user:user,listproblemsbytag,tag,wallOfFrame})
    
}

getProblemDetails = async(req,res)=>{
    let user = null;
    if(req.user){
        user = req.user;
    }
    const message = {}
    message.success = req.flash('success');
    message.apath = req.flash('apath');
    message.fail = req.flash('fail');
    message.error = req.flash('error');
    const id  = req.params.id;
    try{
        const problem = await Problem.findById({_id:id.toString()}).populate('category','name');
        const inexam = problem.inexample;
        const outexam = problem.outexample; 
        const tr = inexam.replace(/(?:\r\n|\r|\n)/g, '<br>');
        const tr2 = outexam.replace(/(?:\r\n|\r|\n)/g, '<br>');
        problem.inexample = tr;
        problem.outexample = tr2;
        res.render('problemdetails',{problem,user,message});
    }
    catch(err){
        console.log(err);
    }
}

submitSourceCode =  async (req,res)=>{
    const language = req.body.language;
    const sourceCode = req.body.sourcecode;
    const id = req.params.id.toString();
    const problem = await Problem.findById({_id:id}).populate('testcase');
    const testcases = problem.testcase;
    const tests = await readInput(testcases);
    let score = 0;
    let completed = false;
    let err = '';
    if(sourceCode.trim()==''){
        req.flash('error','Xảy Ra Lỗi Khi Biên Dịch');
        res.redirect('/problems/'+id);
    }
    else{
        try{
            for(var i=0;i<tests.length;i++){
                const sourceRes = await complieSource(language,sourceCode,tests[i].input);
                let stringOutRes = sourceRes.body.output;
                let expectedOutRes = tests[i].output;
                const sourceFomat = await formatOutput(stringOutRes.trim());
                const expetedFormat = await formatOutput(expectedOutRes.trim());
                console.log({sourceFomat});
                console.log({expetedFormat});
                if(sourceFomat==expetedFormat){
                    score+=5;
                    if(score==10){
                        completed= true;
                    }
                }
                else{
                    if(sourceRes.body.memory==null){
                        err = sourceRes.body.output;
                        break;
                    }
                    else{
                        score+=0;
                    }
                }
                
            }
            if(completed===true){
                req.flash('success','Vượt qua 2/2 Test. Bạn Đạt Được '+score+' Điểm');
            }
            else if(completed===false && score>0){
                req.flash('apath','Vượt qua 1/2 Test. Bạn Đạt Được '+score +' Điểm');
            }
            else if(completed===false && err==''){
                req.flash('fail','Vượt qua 0/2 Test. Hãy Cố Gắng Hơn Nữa');
            }
            else{
                req.flash('error',err);
            }
            const userId = req.user._id;
            const problemId = id;
            const submition = Submition({
                problem:problemId,
                user:userId,
                score:score,
                completed:completed
            })
            const temp = await submition.save();
            res.status(200).redirect('/problems/'+id);
        }
        catch(err){
            console.log(err);
        }
    }
}

complieSource =  (language,sourceCode,input)=>{
   return new Promise((get,drop)=>{
    const info = {
        clientId:'8f0a8fa355b6a821474c2970ee61cf82',
        clientSecret:'8b375df100bef5665afa428af6dcda80ec53bfee5fab8081065f4c9b8b2243c3',
        script:sourceCode,
        language:language,
        versionIndex:'2',
        stdin:input
    }
    request({ 
        url: 'https://api.jdoodle.com/execute',
        method: "POST",
        json: info
    },
    function(error,res,body){
        if(error){
            drop(error);
        }
        else{
            get(res);
        }
    })
   })
}

readInput = (testcases)=>{
    return new Promise((get,drop)=>{
        try{
            const inputArrObj= testcases.map(testcase=>{
                const inputString = fs.readFileSync('public\\'+testcase.input);
                const outputString = fs.readFileSync('public\\'+testcase.output);
                const input = {input:inputString.toString(),output:outputString.toString()};
                return input;
            })
            get(inputArrObj);
        }
        catch(err){
            drop(err);
        }
    })
}

readSolution = (solution)=>{
    return new Promise((get,drop)=>{
        const inputString = fs.readFileSync('public\\'+solution);
        get(inputString.toString());
    })
}

formatOutput = (output)=>{
    return new Promise((get,drop)=>{
        try{
            const lines = output.split('\n');
            console.log(lines);
            if(lines.length>1){
                const trimLines = lines.map(line=>{
                    line = line.trim();
                    return line;
                })
                const outString = trimLines.join('\n');
                get(outString);
            }
            else{
                get(lines[0]);
            }
        }
        catch(err){
            drop(err);
        }
    })
  
}

getListSubmition = (problems,userid)=>{
    return new Promise((get,drop)=>{
        try{
            const submitions = problems.map(async(problem)=>{
                const problemid = problem._id;
                const submition = await Submition.find({problem:problemid,user:userid});
                return submition;
            })
            get(submitions);
        }
        catch(err){
            drop(err);
        }
    })
}

getListHighestSubmition = (problems,userid)=>{
    return new Promise((get,drop)=>{
        try{
            const submitions = problems.map(async(problem)=>{
                const problemid = problem._id;
                const submition = await Submition.findOne({problem:problemid,user:userid}).sort({score:-1});
                return submition;
            })
            get(submitions);
        }
        catch(err){
            drop(err);
        }
    })
}


getWallOfFrame = async ()=>{
    const result = await Submition.aggregate([
        {$group:{_id:{"user":'$user','problem':'$problem'}, "maxValue": {$max:"$score"}}}]
    );
    const listUsers = await User.find({admin:false});
    const wallOfFrame = listUsers.map((user)=>{
        const id = user._id.toString();
        let totalScore = 0;
        for(var i =0;i<result.length;i++){
           if(id==result[i]._id.user.toString()){
               totalScore+=result[i].maxValue;
           }
        }
        const info = {
            userid:id,
            totalScore:totalScore,
            username:user.username,
            name:user.name
        }
        return info;
    })
    function compare(a,b){
        if ( a.totalScore > b.totalScore ){
            return -1;
          }
          if ( a.totalScore < b.totalScore ){
            return 1;
          }
          return 0;
    }

    wallOfFrame.sort(compare);

    return wallOfFrame;
}

module.exports = {
    renderCategories:renderCategories,
    getProblemDetails:getProblemDetails,
    submitSourceCode:submitSourceCode,
    renderProblemsByCategoryId:renderProblemsByCategoryId,
    renderProblemsByTagId:renderProblemsByTagId
}