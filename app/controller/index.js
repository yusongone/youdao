var router=require("./router");
var playback=require("./lib/playback");
var emailTo=require("./lib/email_to");


function ex(app){
  router.init(app);
}


ex.Playback=playback;
ex.EmailTo=emailTo;
module.exports=ex;
