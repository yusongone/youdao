var mongodb=require("mongodb");
var Server=mongodb.Server,
    Db=mongodb.Db;
var config=require("../../../config.json");

var db=new Db("transdb",new Server('localhost',27017),{safe:true});
var _db_con;

function _initConnection(callback){
    db.open(function(err,db_con){
        if(!err){
            _db_con=db_con;
            _db_con.authenticate(config.db.user,config.db.pass,function(err,ddb){
                if(!err) {
                    callback(null,_db_con);
                }else{
                    callback(err);
                    throw("get mongo conection faild");
                }
            });
        }else{
            callback(err);
            throw("get mongo conection faild");
        }
    });
}

exports.initConnection=_initConnection;

exports.getCon=function(callback){
    if(!_db_con){
        _initConnection(callback);
    }else{
        callback(null,_db_con);
    }
}
