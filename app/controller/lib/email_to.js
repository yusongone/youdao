var config=require("../../../config.json");
var nodemailer = require('nodemailer');

var makejsServer= nodemailer.createTransport({
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


function _sendEmail(json,callback){
    makejsServer.sendMail({
        from:"蛛丝马迹 <"+config.email.mail+">",
        to:json.to,
        subject:json.subject,
        text:json.text,
        html:json.html
    },function(err){
        callback?callback(err):"";
        makejsServer.close();
    });
};

function _sendTokindle(json){
    console.log("send to kindle "+json.fileName);
    makejsServer.sendMail({
        from:"蛛丝马迹 <"+config.email.mail+">",
        to:'mutou2002_war3_39@kindle.cn,server@makejs.com',
        subject:'convert',
        html:'<a href="http://www.makejs.com">convert kindle</a>',
        attachments: [
            {
                filename:json.fileName,
                contentType:"text/html",
                content: json.text
            }
        ]
    },function(a,b,c){
        console.log(a,b,c);
        makejsServer.close();
    });
};


exports.sendTokindle=_sendTokindle;
exports.sendEmail=_sendEmail;

