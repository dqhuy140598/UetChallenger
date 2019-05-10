const express = require('express');
const User = require('../models/user');
const router = express.Router();
const validator = require('express-validator');
const homeController = require('../controllers/homecontroller');
const bodyparser = require('body-parser');
const midleware = require('../midleware/auth')
const frontProblemController = require('../controllers/problems')
const frontBlogController = require('../controllers/blog');

router.use(bodyparser.json());

router.use(bodyparser.urlencoded({extended:true}));

router.use(validator());

router.get('/',midleware.auth,async (req,res)=>{
    homeController.renderHome(req,res);
})
router.get('/home',midleware.auth,async (req,res)=>{
    homeController.renderHome(req,res);
});

router.get('/categories',midleware.auth,async (req,res)=>{
    frontProblemController.renderCategories(req,res);
})

router.get('/categories/:id',midleware.checkToSolveProblem,async(req,res)=>{
    frontProblemController.renderProblemsByCategoryId(req,res);
})

router.get('/tag/:id',midleware.checkToSolveProblem,async(req,res)=>{
    frontProblemController.renderProblemsByTagId(req,res);
})

router.get('/problems/:id',midleware.checkToSolveProblem,async (req,res)=>{
    frontProblemController.getProblemDetails(req,res);
})

router.post('/problems/:id',midleware.checkToSolveProblem,async (req,res)=>{
    frontProblemController.submitSourceCode(req,res);
})

router.get('/blogs',(req,res)=>{
    frontBlogController.getListBlogs(req,res);
})

router.get('/blogs/:id',(req,res)=>{
    frontBlogController.getBlogById(req,res);
})

router.get('/about/',(req,res)=>{
    res.render('about');
})

module.exports = router;