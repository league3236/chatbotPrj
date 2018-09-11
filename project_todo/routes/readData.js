module.exports=function(database,callback){
    var collection = databse.collection('testCallection');

    collection.find({}).toArray(function(err,result){
        console.log("Found the following records");

         callback(err,result);
    });
}
