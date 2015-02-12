var router=require("express").Router();
var word_sound=require("../../../model").word_sound;
var controller=require("../../../controller");
var model=require("../../../model");


module.exports=function(app){
  app.use("/word",router);
}

router.get("/today",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }

  model.local_word.getDayWord({
    "userId":req.session.userId+""
  },function(err,result){
    res.render("today_word",{
      "head":"abc",
      "wordList":result
    });
  });
});

router.get("/all",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }
  model.local_word.getUserAllWord({"userId":req.session.userId+""},function(err,result){
    console.log(result);
    res.render("today_word",{
      "head":"abc",
      "wordList":result
    });
  });
});


