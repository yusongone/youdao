var youdaoModel=require("../../model").youdao;
function init(app){
    app.post("/getTranslateData",function(req,res){
        var requestString=req.body.q;
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
