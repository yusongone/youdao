var router=require("express").Router();
var model=require("../../../model");
var word_sound=model.word_sound;
var users=model.users;
var controller=require("../../../controller");


module.exports=function(app){
  app.use("/",router);
}

router.get("/",function(req,res,next){
    res.redirect("/trans/word/");
});





