var poolMain=require("./pool").pool;
var mongodb=require("mongodb"),
	objectId=mongodb.ObjectID;

function createObjId(){
 	try{
        str=str.toString();
        return  new objectId(str);
    }catch(err){
        console.error("createObjectId:",err);
        return false;
    }
}


function _addWord(json,callback){
var objId=new objectId();
	poolMain.acquire(function(err,database){
		var col=database.collection("word");
			col.findOne({"word":json.word,"userId":json.userId},function(err,result1){
					if(null==result1){
            console.log("insert");
						col.insert({"userId":json.userId,"_id":objId,"word":json.word,"trans":json.obj},function(err){
							_addWordDate({userId:json.userId,wordId:objId},function(err){
              updateSentence();
							});
						});
					}else{
						_addWordDate({userId:json.userId,wordId:result1._id},function(err,result2){
            updateSentence();
						});
					};
          function updateSentence(){
						poolMain.release(database);
				    col.update({"userId":json.userId,"word":json.word},{$addToSet:{"sentence":json.sentence}},function(err,result){});
          }
			});
	});
};

function _addWordDate(json,callback){
	var dateObj=new Date();
	var wordId=json.wordId;
	var d=dateObj.getFullYear()+"-"+(1+dateObj.getMonth())+"-"+dateObj.getDate();
	poolMain.acquire(function(err,database){
		var col=database.collection("date");
		col.findOne({"userId":json.userId,"date":d},function(err,result){
			if(null==result){
				col.insert({"userId":json.userId,"date":d,"wordList":[wordId]},function(err,result){
				callback(err,result);
});
			}else{
				col.update({"userId":json.userId,"date":d},{$addToSet:{"wordList":wordId}},function(err,result){
				callback(err,result);
});
			};
		});
	});
}

function _getWordList(json,callback){
	poolMain.acquire(function(err,database){
		var dateObj=new Date();
		var d=json.date||dateObj.getFullYear()+"-"+(1+dateObj.getMonth())+"-"+dateObj.getDate();
		var col=database.collection("date");
		col.findOne({"date":d,"userId":json.userId},{"wordList":1,"_id":0},function(err,result){
			if(!result){
				callback(err,[]);
				poolMain.release(database);
				return;
			}
			var wl=result.wordList;
			var ary=[];
				for(var i=0;i<wl.length;i++){
					ary.push(new objectId(wl[i]));
				}
			var wdcol=database.collection("word");
				wdcol.find({"_id":{$in:ary}},{"_id":0,"word":1,"trans":1}).sort({"_id":-1}).toArray(function(err,result2){
					callback(err,result2);
					poolMain.release(database);
				});
		});
	});
}


function _getUserAllWord(json,callback){
	poolMain.acquire(function(err,database){
			var wdcol=database.collection("word");
				wdcol.find({"userId":json.userId},{"_id":0,"sentence":1,"word":1,"trans":1}).sort({"_id":-1}).toArray(function(err,result2){
					callback(err,result2);
					poolMain.release(database);
				});
  });
}

function _getDateList(json,callback){
	poolMain.acquire(function(err,database){
			var dtcol=database.collection("date");
				dtcol.find({"userId":json.userId},{"_id":0}).sort({"_id":-1}).toArray(function(err,result2){
					callback(err,result2);
					poolMain.release(database);
				});
  });
  
}
exports.addWord=_addWord;
exports.getWordList=_getWordList;
exports.getUserAllWord=_getUserAllWord;
exports.getDateList=_getDateList;
