const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next)=>{
        const path = req.url.split('/')[2];
        const message = {
            signup:"",
            login:""
        }
        try{
        const token = req.cookies.token;
        const decoded = await jwt.verify(token,'thisismynewcourse');
        user = await User.findOne({_id:decoded._id,'tokens.token':token});
        if(!user){
            throw new Error('Bạn Phải Đăng Nhập');
        }
        else{
            req.user = user;
        }
        next();
    }
    catch(err){
        res.status(503).render(path);
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

module.exports = {
    auth:auth,
    checkAdmin:checkAdmin
}