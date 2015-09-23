var router=require("express").Router();
var word_sound=require("../../../model").word_sound;
var controller=require("../../../controller");
var model=require("../../../model");


module.exports=function(app){
  app.use("/query",router);
}

router.post("/getDateList",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }
  model.local_word.getDateList({"userId":req.session.userId+""},function(err,result){
    if(!err){
      res.send(result);
    }else{
      res.send(err);
    }
  });
});

router.post("/getOneDayWordList",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }
  var date=req.body.date;
  model.local_word.getOneDayWordList({"date":date,"userId":req.session.userId+""},function(err,result){
    if(!err){
      res.send(result);
    }else{
      res.send(err);
    }
  });
});




