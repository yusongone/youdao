var fs=require("fs");
var config=require("../../../config.json");

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    //service: '163',
    //host:'smtp.ym.163.com',
    //port:465,
    //secureConnection:true,
    host:'smtp.ym.163.com',
    port:25,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user:config.email.mail,
        pass:config.email.pass
    }
});


exports.send=function(){
    transporter.sendMail({
        from:"蛛丝马迹 <"+config.email.mail+">",
        to:'yusongone@gmail.com',
        subject:'邮箱验证',
        text:'http://1abc.com',
        html:'<a href="http://www.makejs.com">this is a link</a>'
    },function(a,b,c){
        console.log(a,b,c);
        transporter.close();
    });
};

function sendTokindle(){
    transporter.sendMail({
        from:"蛛丝马迹 <"+config.email.mail+">",
        //to:'mutou2002_war3@kindle.cn,yusongone@gmail.com',
        //to:'mutou2002_war3@kindle.cn',
        to:'mutou2002_war3_39@kindle.cn,server@makejs.com',
        //to:'yusongone@gmail.com',
        //to:'m13161035889@163.com',
        subject:'convert',
        html:'<a href="http://www.makejs.com">this is a link</a>',
        attachments: [
            {
                filename: 'test6.html',
                //contentType:"text/html",
                content: "<!DOCTYPE html><head></head><body><div><h1>hello world!这只是一个测试</h1><h3>ceshi</h3></div></body></html>"
                //content:fs.createReadStream('../../../test2.html')
                //path:"../../../test.html"
            }
        ]
    },function(a,b,c){
        console.log(a,b,c);
        transporter.close();
    });
}

function createActiveMailLink(){
    var time=parseInt(new Date().getTime()/1000).toString();
    var str=time+","+"yusongone@gmail.com";
    var bs=new Buffer(str).toString("base64");
        bs=bs[Math.floor(Math.random()*8)]+bs;
    console.log(str);
    console.log(bs);
    var c=new Buffer(bs.substr(1),'base64').toString();
    console.log(c);
}

//sendTokindle();

