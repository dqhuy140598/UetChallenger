const express = require('express')

const validator = require('express-validator')

const midleware = require('../midleware/auth')

const router = express.Router()

const bodyparser = require('body-parser');

const multer = require('multer');

const blogController = require('../controllers/blogcontroller');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/admin/uploads/blogs');
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

router.use(bodyparser.json({ limit: '50mb' }));
router.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));

router.use(validator())

router.get('/admin/addblog',midleware.checkAdmin,(req,res)=>{
    res.render('addblog');
})

router.post('/admin/addblog',cbUpload,(req,res)=>{
    blogController.addBlog(req,res);
})

router.get('/admin/listblog',midleware.checkAdmin,(req,res)=>{
    blogController.getListBlog(req,res);
})

router.get('/admin/editblog/:id',midleware.checkAdmin,(req,res)=>{
    blogController.getEditBlog(req,res);
})
router.post('/admin/editblog/:id',cbUpload,(req,res)=>{
    blogController.updateBlog(req,res);
})

router.get('/admin/deleteblog/:id',midleware.checkAdmin,(req,res)=>{
    blogController.deleteBlog(req,res);
})



module.exports = router;