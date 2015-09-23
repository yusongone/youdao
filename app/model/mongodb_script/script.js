var pool=require("../lib/db_pool");


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

//changeDateStringToTimestamp();
