var router=require("express").Router();
var model=require("../../../model");
var youdaoModel=model.youdao;
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
  if(!req.session.userId){
      res.send({"status":"fail","message":"login time out"});
      return;
  }
  youdaoModel.getData(requestString,function(err,string){
  var obj=JSON.parse(string);
      if(err){
       res.send({"status":"error"});
       return;
      }
      res.send(string); 
      if(obj.basic){
        model.local_word.addWord({
          word:requestString,
          obj:obj,
          userId:req.session.userId
        },function(){
      });
     }
  }); 
});

