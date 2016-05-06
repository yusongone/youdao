var pool=require("../lib/db_pool");

var ids=[];

function changeDateStringToTimestamp(){
    pool.getCon(function(err,database) {
        var col = database.collection("date");
        var list=col.find({"date":{$exists:true}},{date:1});
        var d=0;
        list.forEach(function(item){
            var timestamp=new Date(item.date).getTime();
            col.update({"_id":item._id},{$set:{date:timestamp}});
            d++;
            console.log(item._id);
            console.log(d+"changed");
        });
    });
}

function changeDateKeyFromTimestampToStr(){
    pool.getCon(function(err,database) {
        var col=database.collection("date");
        var list=col.find({"date":{$exists:true}}).sort({"date":1});
        list.forEach(function(item){
            var str=new Date(item.date).toISOString().substr(0,10);
            col.update({"_id":item._id},{$set:{date:str}});
            console.log(",");
        });
    });
}

function deleteRepeat(){
    pool.getCon(function(err,database) {
        var col=database.collection("date");

        var repeat={};
        var prev={
            date:0,
            userId:0
        };
        var length;
        col.find().toArray(function(e,ary){
            length=ary.length;
            for(var i=0;i<ary.length;i++){
               var item=ary[i];
                if(item.date==prev.date&&item.userId==prev.userId){
                    ids.push(item._id);
                    if(!repeat[item.userId]){
                        repeat[item.userId]={};
                    }
                    if(!repeat[item.userId][prev.date]){
                        repeat[item.userId][prev.date]=[];
                    }
                    repeat[item.userId][prev.date]=repeat[item.userId][prev.date].concat(item.wordList);
                }
                prev.date=item.date;
                prev.userId=item.userId;
            }
            doit(repeat);
        });

        function doit(){
            var index=0;
            var lll=0;
            for(var i in repeat){
                var user=i;
                var dateList=repeat[i];
                for(var j in dateList){
                    lll++;
                    (function(){
                        var u=user;
                        var date=j;
                        var wordList=dateList[j];
                        var list=col.find({"userId":u,"date":date})
                        list.forEach(function(item){
                            index++;
                            console.log(lll,index);
                            col.update({"_id":item._id},{$set:{wordList:wordList}});
                        });

                    })();
                    //col.update({"userId":user,"date":j},{wordList:wordList});
                }
            }
        }
    });
}


//changeDateStringToTimestamp();
//changeDateKeyFromTimestampToStr();
deleteRepeat();
exports.a=changeDateKeyFromTimestampToStr;
exports.b=deleteRepeat;
exports.c=function(){
    pool.getCon(function(err,database) {
        var col=database.collection("date");
        for(var i=0;i<ids.length;i++){
            console.log(i,ids.length);
            col.remove({_id:ids[i]});
        }
    });
};

