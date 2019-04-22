const express = require('express')

const validator = require('express-validator')

const midleware = require('../midleware/auth')

const router = express.Router()
const bodyparser = require('body-parser');

router.use(bodyparser.json());

router.use(bodyparser.urlencoded({extended:true}));

router.use(validator())

router.get('/admin/',midleware.checkAdmin,(req,res)=>{
    res.send('Admin Home Page')
})

router.get('/admin/addcategory',midleware.checkAdmin,(req,res)=>{
    res.send('admin')
})

module.exports = router