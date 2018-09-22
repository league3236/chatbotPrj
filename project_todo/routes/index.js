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
mongoose.Promise = global.Promise;

var dbUrl =config.dbUrl();

//mongoose..
var todoSchema = mongoose.Schema({
    date:Date,
    task:String,
    done:Boolean
});

var todo = mongoose.model("todo",todoSchema,'testCollection');

//map
router.get('/map',function(req,res,next){
    res.render('map');
});

//mapview  /:latitude/:longitude
router.get('/mapview',function(req,res,next){
    console.log(req.param(""));
    res.send(req.params.latitude+','+req.params.longitude);
    //res.render('mapview');
});

//find
router.get('/',function(req,res,next){
    todo.find({},function(err,docs){
        console.log(docs);
        console.log("hi");
        res.render('index',{todo:docs});
    });
});
//save
router.post('/task-register',function(req,res){
    var date = new Date(req.body.date);
    var newTask = req.body.task;
    var obj = {"date":date, "task":newTask, "done":false};
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
