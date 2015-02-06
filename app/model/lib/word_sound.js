var http=require("http");
function getAudio(json,callback){
// With a buffer
    http.get("http://dict.youdao.com/dictvoice?audio="+json.word,function(res){
		var chunkAry=[];
		var length=0;
		res.on('data', function(chunk){
			length+=chunk.length;
			chunkAry.push(chunk);
		});

		res.on('end', function(){
			var buf=Buffer.concat(chunkAry,length);
            callback(null,buf);
		});
    });
}

exports.getAudio=getAudio;
