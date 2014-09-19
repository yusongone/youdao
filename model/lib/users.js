var poolMain=require("./pool").pool;
var crypto=require("crypto");

function _auth(json,callback){
	var id=json.id;
	var pass=json.pass;
	poolMain.acquire(function(err,database){
		var col=database.collection("users");
		var md5=crypto.createHash("md5");
		var md5Pass=md5.update(pass).digest("base64");
		col.find({"account":json.id,"pass":md5Pass}).toArray(function(err,docAry){
			var id;
			if(docAry.length>0){
				id=docAry[0]._id;
			}else{
				id="";
			}
			callback(err,id);
			poolMain.release(database);
		});
	});
}

function _register(json,callback){
	var id=json.id;
	var pass=json.pass;
	poolMain.acquire(function(err,database){
		var col=database.collection("users");
		var md5=crypto.createHash("md5");
		var md5Pass=md5.update(pass).digest("base64");
		col.insert({"account":json.id,"pass":md5Pass},function(err,result){
			poolMain.release(database);
		});
	});
}
exports.auth=_auth;
exports.register=_register;
