var fs = require('fs');
module.exports = function(path, fn){
    fs.readFile(path, function(err, data){
        if(data==(''||null)){
            fn(err, data);
        }else{
            fn(err, JSON.parse(data));
        }
    });
}

/*
module.exports=function(database,callback){
    var collection = database.collection('testCallection');

    collection.find({}).toArray(function(err,result){
        console.log("Found the following records");

         callback(err,result);
    });
}
*/
