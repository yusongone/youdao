var model=require("../../model");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;

function _getOneWeekWordsId(){
    if(arguments.length==1){
        callback=arguments[0];
    }else{
        json=arguments[0];
        callback=arguments[1];
    }
    var finalJson={};
    function parseWordList(wl){
        for(var i=0;i<wl.length;i++){
            finalJson[wl[i].wordId||wl[i]]=wl[i].reqInfo;
        }
    }
    model.local_word.getMultiDayWordList({
        startDate:new Date("2015-08-17").getTime(),
        endDate:new Date("2015-09-24").getTime()
    },function(err,ary){
        for(var i=0;i<ary.length;i++){
            parseWordList(ary[i].wordList);
        }
        var finalAry=[];
        for(var i in finalJson){
            finalAry.push(new objectId(i));
        };
        callback?callback(err,finalAry):"";
    });
}

function getWordsData(words,callback){
    model.local_word.getWordsData({words:words},function(err,data){
        callback(err,data);
    });
}


function _getOneWeekWords(){
    _getOneWeekWordsId(function(err,ary){
        getWordsData(ary,function(err,datas){
            console.log(datas);
        });
    });
}

exports.getOneWeekWords=_getOneWeekWords;
_getOneWeekWords();

