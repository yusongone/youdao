var ajax_router=require("./lib/ajax_router");
var page_router=require("./lib/page_router");

exports.init=function(app){
    ajax_router.init(app);
    page_router.init(app);
}
