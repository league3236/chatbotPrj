var fs = require('fs');

module.exports=function(path,fn){

    fs.readFile(path,function(err,data){

        if(data==(''||null)){
            fn(err,data);
        }else{
            fn(err,JSON.parse(data));
        }
    });
}
