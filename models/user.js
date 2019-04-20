const mongooes = require('../config/database');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');

const userSchema = mongooes.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    username:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    passwordconf:{
        type:String,
        require:true,
        trim:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
    admin:{
        type:Boolean,
        require:true,
        default:0
    }
})
userSchema.pre('save', async function(){
    const user = this;
    if(user.isModified('password')){
       const hash = await bcrypt.hash(user.password,bcrypt.genSaltSync(10));
       user.password = hash;
    }
})

userSchema.statics.checkUserCreated = async function(username,email){
    const checkUserByUserName = await User.findOne({username:username});
    if(checkUserByUserName){
        throw new Error('Tên Đăng Nhập Đã Tòn Tại');
    }
    const checkUserByUserEmail = await User.findOne({email:email});
    if(checkUserByUserEmail){
        throw new Error('Email đã tồn tại')
    }
}

userSchema.statics.checkUser = async (username,password)=>{
    const user = await User.findOne({username:username});
    if(!user) throw new Error('Tên Đăng Nhập Không Tồn Tại Hoặc Không Đúng');
    else{
        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch) throw new Error('Sai Mật Khẩu');
        else{
            return user;
        }
    }
};

userSchema.methods.generateToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}
const User = mongooes.model('User',userSchema);

module.exports = User;