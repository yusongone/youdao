var router=require("express").Router();
var model=require("../../../model");
var youdaoModel=model.youdao;
var wordModel=model.local_word;
var users=model.users;
var word_sound=model.word_sound;


module.exports=function(app){
  app.use("/trans",router);
}

router.get("/get_voice",function(req,res,next){
  word_sound.getAudio({"word":req.query.word},function(err,buf){
      res.writeHead(200, {
      "Accept-Ranges":"bytes",
      'Content-Type': 'audio/mpeg',
      'Cache-Control':'public, max-age=1000*60',
      "Content-Length":buf.length,
      });
      //myReadableStreamBuffer.pipe(res);
      res.end(buf,"binary");
  });
});

router.post("/getTranslateData",function(req,res){
  var requestString=req.body.q;
  var requestSentence=req.body.sentence;
  if(!requestString){
    res.send({"status":"fail","message":"null"});
    return false;
  }
  if(!req.session.userId){
      res.send({"status":"fail","message":"login time out"});
      return;
  }
  _getWordfromYoudao({res:res,req:req,word:requestString,sentence:requestSentence});
});


function _getWordfromYoudao(json){
  var res=json.res;
  var req=json.req;
  youdaoModel.getData({
    "requestString":json.word,
  },function(err,string){
  var obj=JSON.parse(string);
      if(err){
       res.send({"status":"error"});
       return;
      }
      res.send(string); 
      if(obj.basic){
        model.local_word.addWord({
          word:json.word,
          sentence:json.sentence,
          obj:obj,
          userId:req.session.userId
        },function(){
      });
     }
  }); 
}

router.get("/word",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }
  res.render("search_page",{"username":req.session.userName});
});

router.get("/sentence",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }
  res.render("sentence",{"username":req.session.userName});
});

