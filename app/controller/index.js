var page_render=require("./lib/page_render");
var router=require("./router");

module.exports=function(app){
  router.init(app);
}
