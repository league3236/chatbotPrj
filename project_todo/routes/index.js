var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readFile('database/todo.json','utf8',function(err,data){
    if (err) throw err;


    console.log(data);
    if(data==(''||null)){
      res.render('index',{todo:data});
    }else{
      res.render('index',{todo:JSON.parse(data)});
    }
  });
});

module.exports = router;
