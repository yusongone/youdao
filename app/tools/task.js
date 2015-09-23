var Task=(function(){
    function _Task(json){
        this._options=json;
        return this;
    };
    _Task.prototype.getTargetTime=function(){
        var time=this._options.time;
        var timeAry=time.split(":");
        var targetDate=new Date();
        targetDate.setHours(timeAry[0],timeAry[1],timeAry[2]);
        var targetTime=targetDate.getTime();
        return targetTime;
    };
    _Task.prototype.run=function(){
        var self=this;
        var targetTime=self.getTargetTime();
        if(typeof(this._options.handler)=="undefined"){
            console.error("Task need handler,please add handler function to task options");
            return;
        }
        if(targetTime-new Date().getTime()<0&&typeof(this._options.loop)=="undefined"){//time ware ago
            console.error("Task over time,please reset time.");
        }else{
            console.log("Task running ...");
            this.bindCheck(targetTime);
        };
        return this;
    };
    _Task.prototype.bindCheck=function(targetTime){
        var self=this;
        var time=(targetTime-new Date().getTime());
        var nextCheckTime;
        if(time<=0){
            this._options.handler();
            self.checkLoop(targetTime);
            return;
        }
        if(time>30*1000){
            nextCheckTime=time/2;
            console.log("Task will run after "+time+"s later");
        }else{
            nextCheckTime=1000;
        }
        self.timeRun=setTimeout(function(){
            self.bindCheck(targetTime);
        },nextCheckTime);
    };

    _Task.prototype.stop=function(targetTime){
        self.timeRun?clearTimeout(self.timeRun):"";
    };

    _Task.prototype.checkLoop=function(targetTime){
        switch(this._options.loop){
            case _Task.loopType.WORKDAY:
                if(new Date().getDay()==5){
                    targetTime+=(1000*60*60*24*3);
                }else{
                    targetTime+=(1000*60*60*24);
                }
                this.bindCheck(targetTime);
                break;
            case _Task.loopType.DAY:
                targetTime+=(1000*60*60*24);
                this.bindCheck(targetTime);
                break;
            case _Task.loopType.CUSTOM:
                targetTime+=this._options.interval*1000;
                this.bindCheck(targetTime);
                break;
            default:
                break;
        }
    };
    _Task.loopType={
        DAY:1,
        WORKDAY:2,
        CUSTOM:3,
    };

    return _Task;
})();

module.exports=Task;
/*
 var task=new Task({
 loop:Task.loopType.WORKDAY,
 time:"14:45:10",
 handler:function(){
 console.log("abcd");
 }
 });
 task.run();
*/
