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
                var insertJson={};
                    insertJson.userId=json.userId;
                    insertJson._id=objId;
                    insertJson.word=json.word;
                    insertJson.trans=json.obj;
                    insertJson.searchCount=1;
                    insertJson.star=2;
                col.insert(insertJson,function(err){
console.log("add word and sentence");
                    updateSentence();
                    _addWordDate({deviceType:json.deviceType,userId:json.userId,wordId:objId},function(err){
console.log("sentence");
                    });
                });
            }else{
                col.update({"userId":json.userId,"word":json.word},{$inc:{"searchCount":1}},function(err){
console.log("update word and sentence");
                   updateSentence();
                    _addWordDate({deviceType:json.deviceType,userId:json.userId,wordId:result1._id},function(err,result2){
console.log("sentence");
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
	var wordId=json.wordId;
	//var d=Math.floor(new Date().getTime()/100000)*100000;
	var iso=new Date(new Date().getTime()+8*60*60*1000).toISOString();
	var d=iso.substr(0,10);
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
						if(temp.wordId&&temp.wordId.toString()==wordId){
							if(!temp.reqInfo){
								temp.reqInfo=[];
							};
							temp.reqInfo.push(timestamp);
							col.update({"userId":json.userId,"date":d},{$set:{"wordList":list}});
							has=true;
						};
					}
					if(!has){
						list.push({wordId:wordId,reqInfo:[timestamp]});
						col.update({"userId":json.userId,"date":d},{$set:{"wordList":list}});
					}
					callback(err);
				});
			};
		});
	});
}

function _getMultiDayWordList(json,callback){
	pool.getCon(function(err,database){
		var col=database.collection("date");
		col.find({"userId":json.userId,date:{$gte:json.startDate,$lt:json.endDate}},{date:1,wordList:1}).toArray(function(err,ary){
			if(!ary){
				callback(err,[]);
				return;
			}else{
				callback(err,ary);
			}
		});
	});
}

function _getOneDayWordList(json,callback){
	pool.getCon(function(err,database){
		//var d=parseInt(json.date)||Math.floor(new Date().getTime()/100000)*100000;
		var col=database.collection("date");
		col.findOne({"date":json.date,"userId":json.userId},{"wordList":1,"_id":0},function(err,result){
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
			_getWordsData({words:ary},callback);
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

function _getWordsData(json,callback){
	pool.getCon(function(err,database){
		var wdcol=database.collection("word");
		wdcol.find({"_id":{$in:json.words}},{"_id":0}).sort({"_id":-1}).toArray(function(err,result2){
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
exports.getOneDayWordList=_getOneDayWordList;
exports.getMultiDayWordList=_getMultiDayWordList;
exports.getUserAllWord=_getUserAllWord;
exports.getDateList=_getDateList;
exports.getWordsData=_getWordsData;
