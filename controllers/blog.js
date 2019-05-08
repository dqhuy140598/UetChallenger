const Category = require('../models/category');
const Problem = require('../models/problem');
const request = require('request');
const fs = require('fs');
const Submition = require('../models/submition');

const mongoose = require('../config/database');
const User = require('../models/user');
const Post = require('../models/post');

getListBlogs = async (req,res)=>{
    try{
        const lastfiveblog = await Post.find({}).sort({'created':-1}).limit(5);
        const listblog = await Post.find({});
        res.render('blogs',{listblog,lastfiveblog});
    }
    catch(err){
        console.log(err);
    }
}

getBlogById = async(req,res)=>{
    const id = req.params.id.toString();
    try{
        const lastfiveblog = await Post.find({}).sort({'created':-1}).limit(5);
        const blogpost = await Post.findById({_id:id});
        let newContent = blogpost.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
        let newDescription = blogpost.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
        blogpost.content = newContent;
        blogpost.description = newDescription;
        res.render('blogdetails',{blogpost,lastfiveblog});
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    getListBlogs:getListBlogs,
    getBlogById:getBlogById
}