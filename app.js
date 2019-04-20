const express = require('express');
const userRouter = require('./routers/users')
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const viewPath = path.join(__dirname,'./views');


const publicPath = path.join(__dirname,'./public');
const cookieParser = require('cookie-parser');
app.use(express.static(publicPath));


app.use(cookieParser());
app.use(userRouter);
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.set('views',viewPath);
app.set('view engine','hbs');

app.get('/',(req,res)=>{
    res.render('index');
})

app.listen(3000,()=>{
    console.log('server is in port 3000');
})
