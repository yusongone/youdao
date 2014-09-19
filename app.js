var express=require("express");
var cookieParser=require("cookie-parser");
var session=require("express-session");
var bodyParser=require("body-parser");
var ejs=require("ejs");
var MemoryStore=new session.MemoryStore;
var router=require("./router");
var app=express();


app.listen(3000);

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
    cookie: {maxAge:20*1000, secure: true }
}));

app.set("views",__dirname+"/views");
app.engine("html",ejs.renderFile);
app.set('view engine', 'html');


app.use(function(req,res,next){
    console.log("have a request");
    next();
});
return;
router.init(app);

