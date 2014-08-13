var youdaoModel=require("../../model").youdao;
var users=require("../../model").users;
var model=require("../../model");
var count=0;

function init(app){
    app.post("/getTranslateData",function(req,res){
        var requestString=req.body.q;
		if(!req.session.userId){
				res.send({"status":"fail","message":"login time out"});
				return;
		}
		count++;
		console.log(count+":== "+requestString + "");
		youdaoModel.getData(requestString,function(err,string){
		var obj=JSON.parse(string);
           if(err){
           }
           res.send(string); 
		   if(obj.basic||obj.web){
				model.local_word.addWord({word:requestString,obj:obj,userId:req.session.userId},function(){});
		   }
       }); 
    });

    app.post("/login",function(req,res){
		var id=req.body.id;
		var pass=req.body.pass;
		users.auth({"id":id,"pass":pass},function(err,data){
			if(err){
				res.send({"status":"error"});
			}
			if(data){
				req.session.userId=data;
				console.log(req.session);
				res.send({"status":"ok"});
			}else{
				res.send({"status":"auth fail"});
			}
		});

	});
}

exports.init=function(app){
    init(app);
}
