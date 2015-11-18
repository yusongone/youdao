var router=require("express").Router();

module.exports=function(app){
    app.use("/setup",router);
};

router.get("/",function(req,res,next){
    res.render("setup",{"username":req.session.userName});
});
