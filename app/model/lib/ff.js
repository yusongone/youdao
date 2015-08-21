var fs=require("fs");


function ori(){
    fs.readFile("etymon.js",function(err,f){
        parse(f.toString());
    });
    function parse(str){
        var d=fs.createWriteStream("eef.js");

        str=str.replace(/\n/g,"\",\n");
        str=str.replace(/= /g,"= \"");
        str=str.replace(/\n/g,"\n\"");
        str=str.replace(/ =/g,"\" =");
        str=str.replace(/=/g,":");
        str+="--";
        str=str.replace(/,\n\"--/g,"");
        str="var data={\n\""+str+"\n}"
        str+="\nexports.data=data;";
        d.write(str);
    }
};
function fin(){
    var jj=require("./eef").data;
    var tempObj={};
    for(var i in jj){
        var ary=i.split(",");
        if(ary.length>0){
            ary.forEach(function(o){
                tempObj[o.trim()]=jj[i];
            });
        }else{
            tempObj[i.trim()]=jj[i];
        }
    }
    for(var i in tempObj){
       var z="review";
        if(z.indexOf(i)>-1){
           console.log(i,tempObj[i]);
        };
    }
    //var fin=fs.createWriteStream("fin.json");
    //fin.write(JSON.stringify(tempObj,null,2));
}

fin();
//ori();
