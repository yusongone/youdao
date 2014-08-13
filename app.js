var express=require("express");
var cookieParser=require("cookie-parser");
var session=require("express-session");
var bodyParser=require("body-parser");
var ejs=require("ejs");
var MemoryStore=new session.MemoryStore;
var router=require("./router");
var app=express();


app.listen(80);

app.use(express.static(__dirname+'/public'));
app.use(cookieParser("keyboard cat"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
      extended: true
}));
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret: 'keyboard cat',
    cookie: { secure: true }
}));

app.set("views",__dirname+"/views");
app.engine("html",ejs.renderFile);
app.set('view engine', 'html');
var count=0;
app.use(function(req,res,next){
var d=req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    console.log(count+":"+d+":have a request");
    next();
    count++;
});
router.init(app);


