var device=require("express-device");
var express=require("express");
var cookieParser=require("cookie-parser");
var session=require("express-session");
var bodyParser=require("body-parser");
var ejs=require("ejs");
var mongoStore=require("connect-mongo")(session);
var session_conf=require("./config.json").session_conf;
var app=express();
var Controller=require("./app/controller");
var useragent = require('useragent');
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
app.listen(disport,function(){
	console.log("listen at "+disport);
});

app.use(device.capture());
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
var count=0;
app.use(function(req,res,next){
var d=req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var agent=useragent.parse(req.headers['user-agent']);
  console.log(req.headers["user-agent"]);
  var parser = new device.Parser(req);
  var dd=agent.device.toString();
    console.log("------",dd);
    console.log("+++++++++++++++",parser.get_type());
    next();
    count++;
});

Controller(app);
