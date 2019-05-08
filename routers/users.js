const express = require('express');
const User = require('../models/user');
const midleware = require('../midleware/auth');
const router = express.Router();
const validator = require('express-validator');

const bodyparser = require('body-parser');

router.use(bodyparser.json());

router.use(bodyparser.urlencoded({extended:true}));

router.use(validator());

router.get('/user/login', midleware.auth, async (req,res)=>{
    if(req.user.admin==0){
        res.render('login',{err:'Bạn đã đăng nhập với tài khoản '+ req.user.username,user:req.user});
    }
    else if(req.user.admin==1){
        console.log(req.user);
        res.status(200).redirect('/admin')
    }
})

router.post('/user/login',async (req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;
    req.checkBody('username','Tên Đăng Nhập Không Thể Để Trống').notEmpty();
    req.checkBody('password','Mật Khẩu Không Thể Để Trống').notEmpty();
    const err = req.validationErrors();
    if(err){
        console.log(err);
        res.render('login',{err:err[0].msg});
    }
    try{
        const user = await User.checkUser(username,password,next);
        const token = await user.generateToken();
        res.cookie('token',token,{maxAge:900000,httpOnly:true});
        if(user.admin==0) res.status(200).redirect('/');
        else res.status(200).redirect('/admin')
    }
    catch(err){
        res.render('login',{err:err.message});
    }  
})


router.get('/user/signup',midleware.auth, async (req,res)=>{
    if(req.user.admin==0){
        res.render('login',{err:'Bạn đã đăng nhập với tài khoản '+ req.user.username,user:req.user});
    }
    else if(req.user.admin==1){
        res.redirect('/admin');
    }
})
router.post('/user/signup', async (req,res,next)=>{

    const data = {};
    data.name = req.body.name;
    data.email = req.body.email;
    data.password = req.body.password;
    data.passwordconf = req.body.passwordconf;
    data.username = req.body.username;

    req.checkBody('username','Username là bắt buộc').notEmpty();
    req.checkBody('name','Tên Người Dùng Là Bắt Buộc').notEmpty();
    req.checkBody('email','Email là bắt buộc').notEmpty();
    req.checkBody('email','Email có định dạng không đúng').isEmail();
    req.checkBody('password','Password là bắt buộc').notEmpty();
    req.checkBody('passwordconf','Xác Nhận Password không trùng khớp').equals(req.body.password);

    const err = req.validationErrors();

    if(err){
        console.log(err);
        res.render('signup',{err:err[0].msg});
    }
    else{
        const user = new User(data);
        try{
            await User.checkUserCreated(user.username,user.email);
            const token = await user.generateToken();
            res.cookie('token',token,{maxAge:900000,httpOnly:true});
            res.status(200).redirect('/');
        }
        catch(err){
            res.status(400).render('signup',{err:err.message});
        }
    }
})

router.get('/user/logout',midleware.auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !==  req.cookies.token;
        })
        await req.user.save();
        res.status(200).redirect('/user/login');
    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;