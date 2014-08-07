var youdaoModel=require("../../model").youdao;
var count=0;
function init(app){
    app.post("/getTranslateData",function(req,res){
        var requestString=req.body.q;
		count++;
		console.log(count+":== "+requestString + "");
       youdaoModel.getData(requestString,function(err,string){
           if(err){
            }
           res.send(string); 
       }); 
    });
}
exports.init=function(app){
    init(app);
    }
