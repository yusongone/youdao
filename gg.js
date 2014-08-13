var http=require("http");


function getAudio(json,callback){
		// With a buffer
    http.get("http://www.w3school.com.cn/i/song.mp3",function(res){
//    http.get("http://192.168.1.103:3111/get_voice.mp3?word=abc",function(res){
			console.log(res);
		var chunkAry=[];
		var length=0;
		res.on('data', function(chunk){
			length+=chunk.length;
			chunkAry.push(chunk);
		});

		res.on('end', function(){
			var buf=Buffer.concat(chunkAry,length);
		});
    });
}
getAudio();
