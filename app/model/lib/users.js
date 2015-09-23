var pool=require("./db_pool");
var crypto=require("crypto");

function _auth(json,callback){
	var id=json.id;
	var pass=json.pass;
	pool.getCon(function(err,database){
		var col=database.collection("users");
		var md5=crypto.createHash("md5");
		var md5Pass=md5.update(pass).digest("base64");
		col.find({"account":json.id,"pass":md5Pass}).toArray(function(err,docAry){
      	var json={};
			if(docAry.length>0){
				json.id=docAry[0]._id;
				json.name=docAry[0].account;
			}
			callback(err,json);
		});
	});
}

function _addUser(json,callback){
	var pass=json.pass;
	pool.getCon(function(err,database){
		var col=database.collection("users");
		var md5=crypto.createHash("md5");
		var md5Pass=md5.update(pass).digest("base64");
        var timestamp=new Date().getTime();
        var emailEbel=null,
            usernameEbel=null;
        _checkEmail({email:json.email},function(){
           checkRes();
        });

        _checkName({username:json.username},function(){
            checkRes();
        });

        function checkRes(){
            col.insert({"account":json.username,"pass":md5Pass,"email":json.email,"active":false,registerTime:timestamp},function(err,result){
                result.timestamp=timestamp;
                callback(err,result);
            });
        }
	});
}

function _checkEmail(json,callback){
	pool.getCon(function(err,database){
		var col=database.collection("users");
		col.find({"email":json.email}).toArray(function(err,result){
            if(err){
               callback(err);
            }else{
                if(result.length>0){
                    callback(null,false);
                }else{
                    callback(null,true);
                }
            }
		});
	});
}

function _checkName(json,callback){
    pool.getCon(function(err,database){
        var col=database.collection("users");
        col.find({"account":json.username}).toArray(function(err,result){
            if(err){
                callback(err);
            }else{
                if(result.length>0){
                    callback(null,false);
                }else{
                    callback(null,true);
                }
            }
        });
    });
}


exports.auth=_auth;
exports.addUser=_addUser;
exports.checkName=_checkName;
exports.checkEmail=_checkEmail;
