var word_sound=require("../../model").word_sound;
function init(app){
    app.get("/",function(req,res,next){
        res.render("search_page",{});
    });
	
	app.get("/get_voice.mp3",function(req,res,next){
		word_sound.getAudio({"word":req.query.word},function(err,buf){
			res.writeHead(200, {
				"Accept-Ranges":"bytes",
				'Content-Type': 'audio/mpeg',
				'Cache-Control':'public, max-age=0',
				"Content-Length":buf.length,
			});
			//myReadableStreamBuffer.pipe(res);
			res.end(buf,"binary");
		});
	});
}

exports.init=function(app){
    init(app);
}
