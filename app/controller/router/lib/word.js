var router=require("express").Router();
var word_sound=require("../../../model").word_sound;
var controller=require("../../../controller");
var model=require("../../../model");


module.exports=function(app){
  app.use("/word",router);
}

router.get("/all",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }
  res.render("today_word",{"username":req.session.userName});
});

router.post("/setStar",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }
  var word=req.body.word;
  var count=req.body.count;
  
  model.local_word.setStar({
    "userId":req.session.userId+"",
    "word":word,
    "star":count
  },function(err,result){
    if(!err){
      res.send({"status":"ok"});
    }else{
      res.send({"status":"failed","message":err});
    }
  });
});


