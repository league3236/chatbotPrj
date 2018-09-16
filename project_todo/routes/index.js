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

// //Connect URL
// //var dbUrl = config.dbUrl;
// var dbUrl='mongodb://ldcc:1234@localhost:27017/project_todo';

// //Use connect method to connect to the server
// MongoClient.connect(dbUrl,{ useNewUrlParser: true },function(err,db){
//     assert.equal(null,err);
//     console.log("Connected successfully to server");

//     db.close();
// });


// router.get('/', function(req, res, next) {
//     MongoClient.connect(dbUrl,{ useNewUrlParser: true },function(err,database){
//         if(err) throw err;

//         var db= database.db('local'); //mongodb 3.0 이상일 경우 데이터베이스 이름 명시해야??

//         var collection = db.collection("testCollection");
//         collection.find({}).toArray(function(err,result){
//             assert.equal(err,null);

//             console.log(result);
//             database.close();
//         });
//     /* 
//         readData(db, function(err, data){
//             if(err) throw err;
//             res.render('index', {todo:data});
//         });
//          */
//     });
// });

// 

/*
router.post('/task-register',function(req,res){
    var task=[];
    var date = req.body.date;
    var newTask = req.body.task;

    var genId = new Date().getTime();

    var obj = {"id":genId, "date":date, "task":newTask, "done":false};

    fs.readFile(dbpath,'utf8',function(err, data){
        if(err) throw err;

        if(data!=''){
            task = JSON.parse(data);
        }

        task.push(obj);

        fs.writeFile(dbpath,JSON.stringify(task),function(err){
            if(err) throw err;
            console.log("saved!!");
            res.redirect('/');
        });
    });
});

router.post('/task-done', function(req, res) {
    var checked= req.body.checked;
    fs.readFile(dbpath, 'utf8', function (err, data) {
        if (err) throw err;
        var obj = JSON.parse(data);
        if(lib.isArray(checked)){
            checked.forEach(function(doneTask){
                for(var i=0; i<obj.length; i++){
                    if(obj[i].id == doneTask){
                        obj[i].done = true;
                    }
                }
            });
            fs.writeFile(dbpath, JSON.stringify(obj), function(err){
                if(err) throw err;
                console.log('done save!!');
            });
        } else {
            for(var i=0; i<obj.length; i++){
                if(obj[i].id == checked){
                    obj[i].done = true;
                    console.log(obj[i]);
                }
            }
            fs.writeFile(dbpath, JSON.stringify(obj), function(err){
                if(err) throw err;
                console.log('done save!!');
            });
        }
    });
    res.redirect('/');
});

*/

module.exports = router;
