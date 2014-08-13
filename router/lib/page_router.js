var word_sound=require("../../model").word_sound;
var controller=require("../../controller");
var model=require("../../model");

function init(app){
	app.get("/",function(req,res,next){
		if(!req.session.userId){
			res.redirect("/login");
		}
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

    app.get("/login",function(req,res,next){
		var head=controller.page_render.head;
		if(req.session.userId){
			res.redirect("/");
		}
        res.render("login",{
			"head":head
		});
    });
    app.get("/logout",function(req,res,next){
		req.session.userId=null;
		res.send("logout");
	});

    app.get("/today",function(req,res,next){
		if(!req.session.userId){
			res.redirect("/login");
		}
		var head=controller.page_render.head;
		model.local_word.getDayWord({"userId":req.session.userId+""},function(err,result){
			res.render("today_word",{
				"head":head,
				"wordList":result
			});
		});
	});
}

exports.init=function(app){
    init(app);
}
