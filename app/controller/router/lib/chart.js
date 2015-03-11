var router=require("express").Router();
var word_sound=require("../../../model").word_sound;
var controller=require("../../../controller");
var model=require("../../../model");


module.exports=function(app){
  app.use("/chart",router);
}

router.get("/",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/login");
  }
  res.render("chart",{"username":req.session.userName});
});


