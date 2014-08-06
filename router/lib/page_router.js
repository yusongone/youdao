function init(app){

    app.get("/",function(req,res,next){
        res.render("search_page",{});
    });
}

exports.init=function(app){
    init(app);
}
