var express = require('express');
var router = express.Router();
var fs = require('fs');
var readData = require('./Modules/readData.js');
var dbpath=require('./dbpath.js');
var lib = require('./lib.js');
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var config = require('./Modules/config.js');
var mongoose = require('mongoose');
var passport = require('passport');

mongoose.Promise = global.Promise;

var dbUrl =config.dbUrl();

//mongoose..
var todoSchema = mongoose.Schema({
    date:Date,
    name:String,
    phone:String,
    personnel:Number, 
    task:String,
    done:Boolean
});

var todo = mongoose.model("todo",todoSchema,'testCollection');
//로그인 확인 소스 추 후에 옮겨야함
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

router.post('/signup', passport.authenticate('signup', {
    successRedirect : '/profile', 
    failureRedirect : '/map', //가입 실패시 redirect할 url주소
    failureFlash : true 
}));

router.post('/login', passport.authenticate('login', {
    successRedirect : '/profile', 
    failureRedirect : '/map', //로그인 실패시 redirect할 url주소
    failureFlash : true 
}));


router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('index', { title: 'You are logged in.' });
});

//map
router.get('/map',function(req,res,next){
    res.render('map');
});

//mapview  /:latitude/:longitude
router.get('/mapview/:latitude/:longitude',function(req,res,next){
    res.render('mapview',{latitude:req.params.latitude,longitude:req.params.longitude});
});

//find
router.get('/',function(req,res,next){
    todo.find({}).sort({date:1}).exec(function(err,docs){

	if (err) throw err;

        res.render('index',{todo:docs});
    });
});
//save
router.post('/task-register',function(req,res){
    var date = new Date(req.body.date);
    var name = req.body.name;
    var phone = req.body.phone;
    var personnel = req.body.personnel;
    var newTask = req.body.task;

    var obj = {"date":date,"name":name,"phone":phone,"personnel":personnel, "task":newTask, "done":false};
    //mongoose
    var task = new todo(obj);
    task.save(function(err){
        if(err) console.log(err);
        res.redirect('/');
    });
});
//update
router.post('/task-done',function(req,res){
    var checked=req.body.checked;
    var objectId = [];
    if(lib.isArray(checked)){
        for(var i=0; i<checked.length;i++){
            objectId.push(checked[i]);
        }
    }else{
        objectId.push(checked);
    }
    /* mongoose */
    todo.update({'_id':{$in:objectId}}, {$set:{'done':true}}, {multi:true}, function(err){
        if(err) console.log(err);
        res.redirect('/');
      });
});
module.exports = router;
