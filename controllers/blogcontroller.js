const Post = require('../models/post');

addBlog = async (req,res)=>{

    const title = req.body.title;
    const description = req.body.description;
    const content = req.body.content;
    const status = (req.body.status==1)?1:0;

    let filePath = '';

    if(req.file){
         filePath = req.file.path.toString()
    }

    const temp = filePath.split('\\');

    temp.shift();
    let imagePath = '';

    temp.forEach(element => {
        imagePath = imagePath +'/'+element    
    });

    console.log(imagePath)

    req.checkBody('title','Tiêu Đề Không Thể Để Trống').notEmpty()
    req.checkBody('content','Nội Dung Không Thể Để Trống').notEmpty()
    const err = req.validationErrors();

    if(err){
        console.log(err);
        res.render('addblog',{err:err[0].msg});
    }
    else{
        const post = Post({
            title:title,
            description:description,
            content:content,
            image:imagePath,
            status:status
        })
        try{
            const result = await post.save();
            console.log(result);
            res.status(200).redirect('/admin/listblog');
        }
        catch(err){
            console.log(err);
        }
    }
}

getListBlog =async (req,res)=>{
    try{
        const listblog = await Post.find({});
        res.render('listblog',{listblog});
    }
    catch(err){
        console.log(err);
    }
}
getEditBlog = async (req,res)=>{
    const error = {message:req.flash('error')};
    const id = req.params.id.toString();
    try{
        const editblog = await Post.findById({_id:id});
        res.render('editblog',{editblog,error});
    }
    catch(err){
        console.log(err);
    }
}

updateBlog = async (req,res)=>{

    const id = req.params.id.toString();
    const title = req.body.title;
    const description = req.body.description;
    const content = req.body.content;
    const status = (req.body.status==1)?1:0;

    let filePath = '';

    if(req.file){
         filePath = req.file.path.toString()
    }

    const temp = filePath.split('\\');

    temp.shift();
    let imagePath = '';

    temp.forEach(element => {
        imagePath = imagePath +'/'+element    
    });

    console.log('imagepath '+imagePath)

    req.checkBody('title','Tiêu Đề Không Thể Để Trống').notEmpty()
    req.checkBody('content','Nội Dung Không Thể Để Trống').notEmpty()
    const err = req.validationErrors();

    if(err){
        req.flash('error',err[0].msg);
        res.redirect('/admin/editblog/'+req.params.id.toString());
    }
    else{
        const newBlog = {
            title:title,
            description:description,
            content:content,
            status:status
        }
        if(imagePath!=''){
            newBlog.image = imagePath
        }
        
        try{
            const result = await Post.findByIdAndUpdate({_id:id.toString()},{$set:newBlog});
            res.redirect('/admin/listblog')
        }
        catch(err){
            console.log(err);
        }
    }
}

deleteBlog = async (req,res)=>{
    const id = req.params.id.toString();
    try{
        const result = await Post.findByIdAndDelete({_id:id});
        res.status(200).redirect('/admin/listblog');
    }   
    catch(err){
        console.log(err);
    }
}   

module.exports =  {
    addBlog:addBlog,
    getListBlog:getListBlog,
    getEditBlog:getEditBlog,
    updateBlog:updateBlog,
    deleteBlog:deleteBlog
}