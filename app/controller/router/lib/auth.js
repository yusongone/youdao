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

router.post("/register",function(req,res){
    var email=req.body.email;
    var name=req.body.username;
    var pass=req.body.pass;
    users.addUser({"username":name,email:email,"pass":pass},function(err,data){

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

router.get("/activeemail/:license",function(req,res,next){
    var base64Str=req.params.license;
    var str=new Buffer(base64Str.substr(1),'base64').toString();
    var timestamp=str.split(",")[0];
    var emailAddress=str.split(",")[1];
    console.log(timestamp,emailAddress);
});

router.post("/checkTypeAbel",function(req,res,next){
    var type=req.body.type;
    if(type=="email"){
        users.checkEmail({email:req.body.value},function(err,status){
            response(req,res,next);
        });
    }else if(type=="name"){
        users.checkName({username:req.body.value},function(err,status){
            response(req,res,next);
        });
    }
    function response(req,res,next){
        if(err){
            req.send({
                err_code:"500",
                msg:err
            });
        }else{
            req.send({
                err_code:"0",
                status:status
            });
        }
    }
});

