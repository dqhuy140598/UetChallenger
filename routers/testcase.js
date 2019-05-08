const express = require('express')

const validator = require('express-validator')

const midleware = require('../midleware/auth')

const router = express.Router()

const bodyparser = require('body-parser');

const multer = require('multer');

const Problem = require('../models/problem')

const testcaseController = require('../controllers/testcasecontroller');

router.use(bodyparser.json());

router.use(bodyparser.urlencoded({extended:true}));

router.use(validator())

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/admin/uploads/testcases');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    },
});

const upload = multer({
     storage:storage,
     limits:{
         fileSize:5000000
     },
     fileFilter: function(req,file,cb){
         if(!file.originalname.match(/\.(txt|doc)$/)){
             req.fileValidationError = 'Định Dạng File Không Đúng';
             return cb(new Error('Định Dạng File Không Đúng'),false);
         }
         else if(file.size > 500000){
             return cb(new Error('Kích Thước File Quá Lớn'),false);
         }
         cb(null,true)
     },
})

const cbUpload = upload.fields([{name:'in',maxCount:2},{name:'out',maxCount:2}]);


router.get('/admin/listtest',midleware.checkAdmin, async (req,res)=>{
    try{
        const listproblem = await Problem.find({}).populate('category','name');
        const problemnotest = listproblem.filter((problem)=>{
            return problem.testcase.length == 0;
        })
        res.render('listtest',{problemnotest})
    }
    catch(err){ 
        console.log(err);
    }
})

router.get('/admin/addtest/:id',midleware.checkAdmin, async (req,res)=>{
    const err = req.flash('error');
    const id = req.params.id.toString();
    try{
        const problemtoadd = await Problem.findById({_id:id});
        res.render('addtest',{problemtoadd,err})
    }
    catch(err){
        console.log(err);
    }
})

router.post('/admin/addtest/:id',function(req,res){
    cbUpload(req,res,function(err){
        if(req.fileValidationError){
            req.flash('error',req.fileValidationError);
            res.status(400).redirect('/admin/addproblem')
        }
        else{
            testcaseController.addTest(req,res);
        }
    })
})

module.exports = router;