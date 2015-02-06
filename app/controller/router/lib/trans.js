var router=require("express").Router();
var youdaoModel=require("../../../model").youdao;
var users=require("../../../model").users;
var model=require("../../../model");


module.exports=function(app){
  app.use("/trans",router);
}
router.post("/getTranslateData",function(req,res){
  var requestString=req.body.q;
  if(!req.session.userId){
      res.send({"status":"fail","message":"login time out"});
      return;
  }
  youdaoModel.getData(requestString,function(err,string){
  var obj=JSON.parse(string);
      if(err){
       res.send({"status":"error"});
       return;
      }
      res.send(string); 
      if(obj.basic){
        model.local_word.addWord({
          word:requestString,
          obj:obj,
          userId:req.session.userId
        },function(){
      });
     }
  }); 
});

