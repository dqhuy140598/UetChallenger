const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next)=>{

        const arrPath = ['index','categories'];

        const length = req.url.split('/').length

        let path = req.url.split('/')[length-1];

        if(path =='' || path=='home'){
            path = 'index';
        }
        else if(path=='logout'){
            path = 'login';
        }
        const checkInPath = arrPath.includes(path);

        const message = {   
                signup:"",
                login:""
            }
        try{
            const token = req.cookies.token;
            if(token!=undefined){
                const decoded = await jwt.verify(token,'thisismynewcourse');
                user = await User.findOne({_id:decoded._id,'tokens.token':token});
                if(!user && checkInPath==true){

                }
                else if(!user){
                    throw new Error('Bạn Phải Đăng Nhập');
                }
                else{
                    req.user = user;
                }
                next();
            }
            else if(checkInPath==true){
                next();
            }
            else{
                console.log('in here')
                throw new Error('Bạn Phải Đăng Nhập');
            }
        }
        catch(err){
            res.status(400).render(path)
        }
}

const checkAdmin = async (req,res,next)=>{
    console.log(req.url);
    try{
        const token = req.cookies.token;
        if(token){
            const decoded = await jwt.verify(token,'thisismynewcourse');
            const user = await User.findOne({_id:decoded._id,'tokens.token':token});
            if(user.admin==1){
                req.user = user
            }
            else{
                throw new Error('Bạn Không Đủ Thẩm Quyền')
            }
            next();
        }
        else{
            throw new Error('Bạn Không Phải Đăng Nhập Trước')
        }
    }
    catch(err){
        res.status(503).render('404',{err:err.message})
    }
}

checkToSolveProblem = async(req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(token!=undefined){
            const decoded = await jwt.verify(token,'thisismynewcourse');
            user = await User.findOne({_id:decoded._id,'tokens.token':token});
            if(!user){
                throw new Error('Bạn Phải Đăng Nhập Để Làm Bài');
            }
            else{
                req.user = user;
            }
            next();
        }
        else{
            throw new Error('Bạn Phải Đăng Nhập Để Làm Bài');
        }
    }
    catch(err){
        res.status(400).render('login',{err:err.message})
    }
}


module.exports = {
    auth:auth,
    checkAdmin:checkAdmin,
    checkToSolveProblem:checkToSolveProblem
}