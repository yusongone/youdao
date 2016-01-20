var router=require("express").Router();
var word_sound=require("../../../model").word_sound;
var controller=require("../../../controller");
var model=require("../../../model");


module.exports=function(app){
    app.use("/analyze",router);
}

router.get("/",function(req,res,next){
    if(!req.session.userId){
        res.redirect("/auth/login");
    }
    res.render("analyze",{"username":req.session.userName});
});


