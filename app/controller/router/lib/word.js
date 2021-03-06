var router=require("express").Router();
var controller=require("../../../controller");
var model=require("../../../model");

module.exports=function(app){
  app.use("/word",router);
}

router.get("/all",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/auth/login");
  }
  res.render("today_word",{"username":req.session.userName});
});

router.get("/apollo",function(req,res,next){

  console.log("feas");

  if(!req.session.userId){
    res.redirect("/auth/login");
  }
  res.render("apollo",{"username":req.session.userName});
});


router.get("/kindle",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/auth/login");
  }
  controller.Playback.getOneWeekHtml({userId:req.session.userId},function(err,html){
        if(err){
          res.render("error",{"username":req.session.userName,msg:err});
          return;
        }
        res.send(html);
        var fileName="zs003"+new Date().toISOString().substr(0,10)+".html";
    return;
        controller.EmailTo.sendTokindle({
          fileName:fileName,
          text:html
        });
    });
});


router.post("/setStar",function(req,res,next){
  if(!req.session.userId){
    res.redirect("/auth/login");
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


