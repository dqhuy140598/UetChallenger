const express = require('express')

const validator = require('express-validator')

const midleware = require('../midleware/auth')

const router = express.Router()

const bodyparser = require('body-parser');

const multer = require('multer');

const CategoryController = require('../controllers/categorycontroller')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/admin/uploads/categories');
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
         if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
             throw new Error('Định Dạng File Không Đúng')
         }
         else if(file.size > 500000){
             throw new Error('Kích Thước File Quá Lớn')
         }
         cb(null,true)
     }
})

const cbUpload = upload.single('image')


router.use(bodyparser.json());

router.use(bodyparser.urlencoded({extended:true}));

router.use(validator())

router.get('/admin/',midleware.checkAdmin,(req,res)=>{
    res.render('admin')
})

router.get('/admin/addcategory',midleware.checkAdmin,(req,res)=>{
    res.render('addcategory')
})

router.post('/admin/addcategory',cbUpload,CategoryController.addCategory);

router.get('/admin/listcategory',midleware.checkAdmin,CategoryController.getListCategory)

router.get('/admin/editcategory/:id',midleware.checkAdmin,CategoryController.getEditCategory)

router.post('/admin/editcategory/:id',cbUpload,CategoryController.updateCategory);

router.get('/admin/deletecategory/:id',midleware.checkAdmin,CategoryController.deleteCategory);

module.exports = router