var express=require("express");
var cookieParser=require("cookie-parser");
var session=require("express-session");
var bodyParser=require("body-parser");
var compress=require("compression");
var ejs=require("ejs");
var mongoStore=require("connect-mongo")(session);
var session_conf=require("./config.json").session_conf;
var app=express();
var model=require("./app/model");
var controller=require("./app/controller");
var Task=require("./app/tools/task");
var store=new mongoStore({
		db:session_conf.dbname,
	            host:session_conf.path,
	            port:session_conf.port,  // optional, default: 27017
	            username:session_conf.user, // optional
	            password:session_conf.pass, // optional
	            collection:session_conf.collection,// optional, default: sessions
	            safe:true
});


var disport=3420;
model.DB.initConnection(function(){
    console.log("mongodb connection created ...");
	app.listen(disport,function(){
		console.log("listen at "+disport);
	});
});

//app.use(compress());
app.use(express.static(__dirname+'/public'));
app.use(cookieParser("keyboard cat"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
      extended: true
}));
app.use(session({
		secret: 'keyboard cat'
		,saveUninitialized:true
		,resave:true
		,store:store
		,maxAge:1000*60*30
}));

app.set("views",__dirname+"/app/views");
app.engine("html",ejs.renderFile);
app.set('view engine', 'html');
app.use(function(req,res,next){
var d=req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
next();
});

controller.initRouter(app);
console.log(Task);
var task=new Task({
	loop:Task.loopType.WORKDAY,
	time:"18:00:00",
	handler:function(){
		console.log("abcd");
	}
});
//task.run();

