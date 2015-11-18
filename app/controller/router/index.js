//var ajax_router=require("./lib/ajax_router");
//var Page_router=require("./lib/page_router");

var word=require("./lib/word");
var search=require("./lib/search");
var trans=require("./lib/trans");
var home=require("./lib/home");
var auth=require("./lib/auth");
var query=require("./lib/query");
var analyze=require("./lib/analyze");
var setup=require("./lib/setup");



exports.init=function(app){
  word(app);
  search(app);
  trans(app);
  home(app);
  query(app);
  analyze(app);
  auth(app);
  setup(app);
};
