var model=require("../../model");
var ejs=require("ejs");
var fs=require("fs");
var path=require("path");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;

var kindleHtml=null;
function _getOneWeekWordsId(json,callback){
    /*
    from sun to today;
    * */
    var finalJson={};
    function parseWordList(wl){
        for(var i=0;i<wl.length;i++){
            finalJson[wl[i].wordId||wl[i]]=wl[i].reqInfo;
        }
    }
    var today=new Date();
    var weekStart=_getWeekStartDate(today);
    model.local_word.getMultiDayWordList({
        startDate:weekStart.getTime(),
        endDate:(new Date().getTime())+(1000*60*60*24),
        userId:json.userId
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

function _getWeekStartDate(date){
    var nowTimestamp=date.getTime();
    var dayIndex=date.getDay();
    var weekStart=new Date(nowTimestamp-dayIndex*1000*60*60*24);
    return weekStart;
}


function _getOneWeekWords(json,callback){
    _getOneWeekWordsId(json,function(err,ary){
        model.local_word.getWordsData({words:ary},function(err,data){
            callback(err,data);
        });
    });
};

function _getOneWeekHtml(json,callback){
    _getOneWeekWords(json,function(err,words){
        var pagePath=path.join(__dirname,"../../views/kindle_page.html");
        var templateString = kindleHtml || fs.readFileSync(pagePath, 'utf-8');
        var html=ejs.render(templateString,{words:words});
        callback(err,html);
    });
};

exports.getOneWeekWords=_getOneWeekWords;
exports.getOneWeekHtml=_getOneWeekHtml;
//_getOneWeekWords({ userId:"53ec343f39ca1ca40441d5b1" });

