var http=require("http");
var fs=require("fs");
var ms=require("mediaserver");

function getAudio(callback){
    http.get("http://dict.youdao.com/dictvoice?audio=hello",function(res){
        var dd;
        res.on("data",function(chunk){
            dd+=chunk;
            });
        res.on("end",function(){
            callback(dd);
            console.log(dd);
            });
    });
}
   var filePath = '/Users/songyu/myProject/youdao/test2.mp3',
    stat = fs.statSync(filePath);

http.createServer(function(request, response) {
    getAudio(function(data){
        response.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });

        // We replaced all the event handlers with a simple call to util.pump()
        //fs.createReadStream(filePath).pipe(response);
        response.end(data,"binary");
        //data.pipe(response);
    });
}) .listen(6600);
