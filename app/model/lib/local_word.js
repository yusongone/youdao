var pool=require("./db_pool");
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
	pool.getCon(function(err,database){
	var col=database.collection("word");
    json.word=json.word.toLowerCase();
	    col.findOne({"word":json.word,"userId":json.userId},function(err,result1){
		    if(null==result1){
            console.log("insert");
                col.insert({"userId":json.userId,"_id":objId,"word":json.word,"trans":json.obj,"searchCount":1,"star":2},function(err){
                    _addWordDate({deviceType:json.deviceType,userId:json.userId,wordId:objId},function(err){
                        updateSentence();
                    });
                });
            }else{
                col.update({"userId":json.userId,"word":json.word},{$inc:{"searchCount":1}},function(err){
                    _addWordDate({deviceType:json.deviceType,userId:json.userId,wordId:result1._id},function(err,result2){
                        updateSentence();
                    });
                });
            };
            function updateSentence(){
                    col.update({"userId":json.userId,"word":json.word},{$addToSet:{"sentence":json.sentence}},function(err,result){});
            };
		});
	});
};

function _addWordDate(json,callback){
	var dateObj=new Date();
	var wordId=json.wordId;
	var d=dateObj.getFullYear()+"-"+(1+dateObj.getMonth())+"-"+dateObj.getDate();
	pool.getCon(function(err,database){
		var col=database.collection("date");
		col.findOne({"userId":json.userId,"date":d},function(err,result){
			var timestamp=parseInt((new Date()).getTime()/1000)+","+(json.deviceType||0);
			if(null==result){
				col.insert({"userId":json.userId,"date":d,"wordList":[{wordId:wordId,reqInfo:[timestamp]}]},function(err,result){
					callback(err,result);
				});
			}else{
				col.findOne({"userId":json.userId,"date":d},function(err,doc){
					var list=doc.wordList;
					var has=false;
					for(var i=0;i<list.length;i++){
						var temp=list[i];
						if(temp.wordId.toString()==wordId&&temp.timestamp.length<20){
							temp.timestamp.push(timestamp);
							col.update({"userId":json.userId,"date":d},{$set:{"wordList":list}});
							has=true;
						};
					}
					if(!has){
						console.log("new line");
						list.push({wordId:wordId,timestamp:[timestamp]});
						col.update({"userId":json.userId,"date":d},{$set:{"wordList":list}});
					}
				});
				return;
				col.update({"userId":json.userId,"date":d},{$addToSet:{"wordList":[{wordId:wordId,timestamp:[timestamp]}]}},function(err,result){
				callback(err,result);
});
			};
		});
	});
}

function _getWordList(json,callback){
	pool.getCon(function(err,database){
		var dateObj=new Date();
		var d=json.date||dateObj.getFullYear()+"-"+(1+dateObj.getMonth())+"-"+dateObj.getDate();
		var col=database.collection("date");
		col.findOne({"date":d,"userId":json.userId},{"wordList":1,"_id":0},function(err,result){
			if(!result){
				callback(err,[]);
				return;
			}
			var wl=result.wordList;
			var ary=[];
				for(var i=0;i<wl.length;i++){
					var wordId=wl[i].wordId||wl[i];
					ary.push(new objectId(wordId));
				}
			var wdcol=database.collection("word");
				wdcol.find({"_id":{$in:ary}},{"_id":0}).sort({"_id":-1}).toArray(function(err,result2){
					callback(err,result2);
				});
		});
	});
}


function _getUserAllWord(json,callback){
	pool.getCon(function(err,database){
			var wdcol=database.collection("word");
				wdcol.find({"userId":json.userId},{"_id":0,"sentence":1,"word":1,"trans":1}).sort({"_id":-1}).toArray(function(err,result2){
					callback(err,result2);
				});
  });
}

function _getDateList(json,callback){
	pool.getCon(function(err,database){
			var dtcol=database.collection("date");
				dtcol.find({"userId":json.userId},{"_id":0}).sort({"_id":-1}).toArray(function(err,result2){
					callback(err,result2);
				});
  });
}

function _getWordData(json,callback){
	pool.getCon(function(err,database){
			var col=database.collection("word");
				col.find({"userId":json.userId,"word":json.word},{"_id":0}).sort({"_id":-1}).toArray(function(err,result2){
					callback(err,result2);
				});
  });
}

function _setStar(json,callback){
	pool.getCon(function(err,database){
			var col=database.collection("word");
					col.update({"userId":json.userId,"word":json.word},{"$set":{"star":json.star}},function(err){
					callback(err);
				});
  });
}

exports.setStar=_setStar;
exports.addWord=_addWord;
exports.getWordList=_getWordList;
exports.getUserAllWord=_getUserAllWord;
exports.getDateList=_getDateList;
exports.getWordData=_getWordData;
