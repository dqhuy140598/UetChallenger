const Category = require('../models/category');
const Problem = require('../models/problem');
const Submition = require('../models/submition');
const User = require('../models/user');
const Post = require('../models/post');
renderHome = async(req,res)=>{
    let user = null;
    if(req.user){
        user = req.user;
    }
    try{
        const listthreeblogs = await Post.find({}).sort({'created':-1}).limit(3);
        const wallofframe = await getWallOfFrame();
        const listproblem = await Problem.find({}).populate('category','name');
        const listcategory = await Category.find({});
        const listTotalSubmition = await getTotalSubmitionByProblems(listproblem);
        const tags = ['Dễ','Trung Bình','Khó','Rất Khó'];
        for(var i = 0;i<listTotalSubmition.length;i++){
            listproblem[i].totalSubmit = await listTotalSubmition[i];
            listproblem[i].type = tags[listproblem[i].tag-1];
        }
        res.render('index',{listcategory,listproblem,user:user,wallofframe,listthreeblogs});
    }
    catch(err){
        console.log(err);
    }
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

getTotalSubmitionByProblems = (problems)=>{
    return new Promise((get,drop)=>{
        try{
            const submitions = problems.map(async(problem)=>{
                const problemid = problem._id;
                const submition = await Submition.find({problem:problemid});
                return submition.length;
            })
            get(submitions);
        }
        catch(err){
            drop(err);
        }
    })
}


module.exports = {
    renderHome:renderHome
}