const Category = require('../models/category')

addCategory = async (req,res)=>{

    const name = req.body.name;

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

    req.checkBody('name','Tên Danh Mục Không Thể Để Trống').notEmpty()

    const err = req.validationErrors();

    if(err){
        console.log(err);
        res.render('addcategory',{err:err[0].msg});
    }

    const category = new Category({
        name:name,
        image:imagePath,
        status:status
    })

    try{
        const saved = await category.save();
        res.status(200).redirect('/admin/listcategory')
    }
    catch(err){
        console.log(err);
    }

}

getListCategory = async (req,res)=>{
    try{
        const listcategory = await Category.find({});
        res.render('listcategory',{listcategory});
    }
    catch(err){
        console.log(err);
    }
}

getEditCategory = async(req,res)=>{
    
    const error = {message:req.flash('error')};
    const id = req.params.id;
    try{
        const editCategory = await Category.findById({_id:id})
        res.render('editcategory',{
            editCategory:editCategory,
            error
        });
    }
    catch(err){
        console.log(err);
    }
}

updateCategory = async (req,res)=>{

    const id = req.params.id;

    const name = req.body.name;

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


    req.checkBody('name','Tên Danh Mục Không Thể Để Trống').notEmpty()

    const err = req.validationErrors();

    if(err){
        req.flash('error',err[0].msg);
        res.redirect('/admin/editcategory/'+req.params.id.toString());
    }
    else{ 
        const newCategory = {
            name:name,
            status:status
        }
        if(imagePath!=''){
            newCategory.image = imagePath
        }
        
        try{
            const result = await Category.findByIdAndUpdate({_id:id.toString()},{$set:newCategory});
            res.redirect('/admin/listcategory')
        }
        catch(err){
            console.log(err);
        }
    }
}

deleteCategory = async (req,res)=>{
    const id = req.params.id.toString();
    try{
        const result = await Category.findByIdAndDelete({_id:id});
        res.redirect('/admin/listcategory');
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    addCategory:addCategory,
    getListCategory:getListCategory,
    getEditCategory:getEditCategory,
    updateCategory:updateCategory,
    deleteCategory:deleteCategory
}