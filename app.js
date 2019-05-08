const express = require('express');
const userRouter = require('./routers/users')
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const viewPath = path.join(__dirname,'./views');
const categoryRouter = require('./routers/category')
const problemRouter = require('./routers/problem');
const testcaseRouter = require('./routers/testcase');
const patialPath = path.join(__dirname,'./views/partials')
const hbs = require('hbs')
const publicPath = path.join(__dirname,'./public');
const indexController = require('./routers/index')
const flash = require('connect-flash');
const blogRouter = require('./routers/blog');
const session = require('express-session');

hbs.registerPartials(patialPath)

const cookieParser = require('cookie-parser');
;

app.use(session({
    secret:'keyboard cat',
    resave: true,
    saveUninitialized:true
}));

app.use(require('connect-flash')());
app.use(express.static(publicPath))
;
app.use(cookieParser('keyboard cat'));
app.use(indexController);
app.use(problemRouter);
app.use(userRouter);
app.use(categoryRouter);
app.use(testcaseRouter);
app.use(express.json());
app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(blogRouter);
app.set('views',viewPath);

app.set('view engine','hbs');

app.get('*',(req,res,next)=>{
    res.render('404');
})


app.listen(3000,()=>{
    console.log('server is in port 3000');
})
