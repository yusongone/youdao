var router=require("express").Router();
var word_sound=require("../../../model").word_sound;
var model=require("../../../model");
var users=model.users;
var controller=require("../../../controller");

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
        if(data&&data.id){
            if(data.active===false){
                return res.send({err_code:500,"status":"need active"});
            }
            req.session.userId=data.id;
            req.session.userName=data.name;
            res.send({err_code:0,"status":"ok"});
        }else{
            res.send({err_code:500,"status":"auth fail"});
        }
    });
});

router.post("/register",function(req,res){
    var email=req.body.email;
    var requestData={};
    requestData.email=email;
    requestData.username=req.body.username;
    requestData.pass=req.body.pass;
    requestData.captcha=req.body.captcha;

    for(var i in requestData){
        if(!requestData[i]){
            return res.send({
                err_code:"500",
                msg:i+" can't be empty!"
            });
        }
    }
    if(requestData.captcha!="77463"){
        return res.send({
            err_code:"500",
            msg:"captcha error"
        });
    }

    users.addUser(requestData,function(err,result){
        if(err){
            res.send({
                err_code:"500",
                msg:err
            });
        }else if(result){
            var activeLink=_createActiveMailLink(email,result.timestamp);
            controller.EmailTo.sendEmail({
                to:email,
                html:activeLink,
                text:'次邮件为激活邮件，如果您没有在"蛛丝马迹"申请注册，请忽略次邮件',
                subject:"邮件激活"
            });
            res.send({
                err_code:"0",
                status:true
            });
        }
    });
});

function _createActiveMailLink(email,time){
    var str=time+","+email;
    var bs=new Buffer(str).toString("base64");
    bs=bs[Math.floor(Math.random()*8)]+bs;
    var link="http://www.makejs.com/auth/activeemail/"+bs;
    var html='<a href='+link+'>'+link+'</a>';
    return html;
};

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
    res.redirect("/auth/login");
});

router.get("/activeemail/:license",function(req,res,next){
    var base64Str=req.params.license;
    var str=new Buffer(base64Str.substr(1),'base64').toString();
    if(str.split(",").length<2){
        return res.send("错误的链接");
    }
    var timestamp=str.split(",")[0];
    var emailAddress=str.split(",")[1];
    var nowTime=new Date().getTime();
    if(nowTime-timestamp>24*60*60*1000){//24 hours
        res.send("链接已经超时");
    }else{
        console.log(timestamp,emailAddress);
        users.activeEmail({
            timestamp:timestamp,
            emailAddress:emailAddress
        },function(err,status){
            if(!err){
                if(status.result.nModified<1){
                    res.send("链接已经超时");
                }else{
                    res.send("已经激活请重新登录");
                };
            }else{
                res.send(err);
            }
        });
    }
});

router.post("/checkTypeAble",function(req,res,next){
    var type=req.body.type;
    var checkValue=req.body.value;
    var _err,_status;

    if(checkValue.length<1){
        _err=type+" can't be empty;";
        return response(req,res,next);
    }


    if(type=="email"){
        var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if(pattern.test(checkValue)){
            users.checkEmail({email:checkValue},function(err,status){
                _err=err;
                _status=status;
                response(req,res,next);
            });
        }else{
            _err="Please use the correct Email!";
            return response(req,res,next);
        }
    }else if(type=="name"){
        users.checkName({username:checkValue},function(err,status){
            _err=err;
            _status=status;
            response(req,res,next);
        });
    }
    function response(req,res,next,err){
        if(_err){
            res.send({
                err_code:"500",
                msg:_err
            });
        }else{
            res.send({
                err_code:"0",
                status:_status
            });
        }
    }
});




