var http=require("http");

function getData(json,callback){
    http.get("http://fanyi.youdao.com/openapi.do?keyfrom=makejs&key=1081520201&type=data&doctype=json&version=1.1&q=" + json.requestString,function(res){
        var resString="";
        res.on("data",function(chunk){
            resString+=chunk;
            });
        res.on("end",function(){
            console.log("get Youdao data successfuly");
            callback(null,resString.toString());
            });
        res.on("error",function(err){
            console.log("get Youdao data error:" + err);
            });
    });
}

exports.getData=getData;
