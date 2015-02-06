//var ajax_router=require("./lib/ajax_router");
//var Page_router=require("./lib/page_router");

var word=require("./lib/word");
var search=require("./lib/search");
var trans=require("./lib/trans");
var home=require("./lib/home");



exports.init=function(app){
  word(app);
  search(app);
  trans(app);
  home(app);
}
