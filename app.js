var http=require("http");
var fs=require("fs");
var ms=require("mediaserver");

http.get("http://fanyi.youdao.com/openapi.do?keyfrom=makejs&key=1081520201&type=data&doctype=json&version=1.1&q=%E7%BF%BB%E8%AF%91",function(res){
    var string="";
    res.on("data",function(chunk){
        string+=chunk;
        });
    res.on("end",function(){
        console.log(string);
        });
    });
   var filePath = '/Users/songyu/myProject/youdao/test2.mp3',
    stat = fs.statSync(filePath);

http.createServer(function(request, response) {

    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    // We replaced all the event handlers with a simple call to util.pump()
    fs.createReadStream(filePath).pipe(response);
})
.listen(6600);
