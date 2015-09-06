var router=require("express").Router();
var word_sound=require("../../../model").word_sound;
var model=require("../../../model");
var users=model.users;

module.exports=function(app){
    app.use("/auth",router);
};



router.post("/login",function(req,res){
    var id=req.body.id;
    var pass=req.body.pass;
    users.auth({"id":id,"pass":pass},function(err,data){
        if(err){
            res.send({"status":"error"});
        }
        if(data){
            req.session.userId=data.id;
            req.session.userName=data.name;
            res.send({"status":"ok"});
        }else{
            res.send({"status":"auth fail"});
        }
    });
});

router.get("/login",function(req,res,next){
    if(req.session.userId){
        res.redirect("/");
    }
    res.render("login",{});
});

router.get("/register",function(req,res,next){
    req.session.userId=null;
    res.render("register",{});
});

router.get("/logout",function(req,res,next){
    req.session.userId=null;
    res.redirect("/login");
});
