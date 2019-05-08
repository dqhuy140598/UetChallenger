const express = require('express')

const validator = require('express-validator')

const midleware = require('../midleware/auth')

const router = express.Router()

const bodyparser = require('body-parser');

const multer = require('multer');

const Category = require('../models/category');

const problemController = require('../controllers/problemcontroller')

router.use(bodyparser.json());

router.use(bodyparser.urlencoded({extended:true}));

router.use(validator())

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/admin/uploads/solutions');
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
         if(!file.originalname.match(/\.(cpp|java)$/)){
             req.fileValidationError = 'Định Dạng File Không Đúng';
             return cb(new Error('Định Dạng File Không Đúng'),false);
         }
         else if(file.size > 500000){
             return cb(new Error('Kích Thước File Quá Lớn'),false);
         }
         cb(null,true)
     },
})

const cbUpload = upload.single('solution')

router.get('/admin/addproblem',midleware.checkAdmin,async (req,res)=>{
    const err = req.flash('error');
    console.log(err);
    try{
        const listcategory = await Category.find({});
        res.render('addproblem',{listcategory,err})
    }
    catch(err){
        console.log(err);
    }
})

router.post('/admin/addproblem',function(req,res){
    cbUpload(req,res,function(err){
        if(req.fileValidationError){
            req.flash('error',req.fileValidationError);
            res.status(400).redirect('/admin/addproblem')
        }
        else{
            problemController.addProblem(req,res);
        }
    })
})

router.get('/admin/listproblem',midleware.checkAdmin,problemController.getListProblem);

router.get('/admin/editproblem/:id',midleware.checkAdmin,problemController.getEditProblem)

router.post('/admin/editproblem/:id',function(req,res){
    cbUpload(req,res,function(err){
        if(req.fileValidationError){
            req.flash('error',req.fileValidationError);
            res.status(400).redirect('/admin/editproblem/'+req.params.id.toString());
        }
        else{
            problemController.updateProblem(req,res);
        }
    })
})

router.get('/admin/deleteproblem/:id',midleware.checkAdmin,problemController.deleteProblem)

module.exports = router;