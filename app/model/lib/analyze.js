var pool=require("./db_pool");
var mongodb=require("mongodb");

/*
*   All word count;
*   Max search count word;
*   Date word count;
* */

function _getWord(){
    pool.getCon(function(err,db){
        var word=db.collection("word");
        word.find().sort({"searchCount":1}).toArray(function(a,b){
        });
    });
};

