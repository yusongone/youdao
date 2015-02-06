var mongodb=require("mongodb"),
	Db=mongodb.Db,
	Server=mongodb.Server,
	objectId=mongodb.ObjectID;
var db_conf=require("../../../config.json").db;
var poolModule=require("generic-pool");
var log=true,
	maxTime=30000,
	maxCon=50;


//表结构数据库连接
pool = poolModule.Pool({
    name     : 'main',
    create   : function(callback) {
			mongodb.MongoClient.connect("mongodb://"+db_conf.ip+"/"+db_conf.dbname,{server:{poolSize:1}},function(err,database){
				if(err){return callback(err);}
					database.authenticate(db_conf.user,db_conf.pass,function(err,ddb){
					callback(err,database);
					});
			});
    },
        destroy  : function(database) { 
            database.close();
         }, //当超时则释放连接
        max: maxCon,   //最大连接数
        idleTimeoutMillis : maxTime,  //超时时间
        log :log 
});

exports.pool=pool;
