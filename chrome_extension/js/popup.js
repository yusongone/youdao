$(document).ready(function(){
    bindEvent();
});
function bindEvent(){
    $("#searchInput").keydown(function(key){
        if(key.keyCode==13){
            getPathData($(this).val());
            }
        });
}
function getaudio(world){
    var d='<video style="display:none;" controls="" autoplay="" name="media"><source src="http://dict.youdao.com/dictvoice?audio='+world+'" type="audio/mpeg"></video>';
    var f=$(d)[0];
    f.onended=function(){
        $(this).remove();
        }
    $("body").append(f);
    console.dir(f);
    }
function getPathData(val){
    $.ajax({
        //url:"http://fanyi.youdao.com/openapi.do?keyfrom=makejs&key=1081520201&type=data&doctype=json&version=1.1&q=%E7%BF%BB%E8%AF%91",
        url:"http://fanyi.youdao.com/openapi.do",
        type:"get",
        data:{
            "keyfrom":"makejs",
            "key":"1081520201",
            "type":"data",
            "doctype":"json",
            "version":"1.1",
            "q":val
        },
        datatype:"json",
        success:function(data){
            console.log(data);
            createList(data);
            getaudio(val);
            }
        });
}
function createList(data){
    var explains_UI=$("<ul/>",{"class":"e_ui"}); 
    var web_UI=$("<ul/>",{"class":"web_ui"}); 
    $("#trans_show").html("").append(explains_UI,web_UI);
    
    var explains=data.basic.explains;
    for(var i=0;i<explains.length;i++){
       var li=$("<li/>",{"html":explains[i]}); 
       explains_UI.append(li);
    }

    var web=data.web;
    for(var i=0;i<web.length;i++){
        var temp=web[i];
        var key="<span class='key'>"+temp.key+"<span/>";
        var value=temp.value;
        var li=$("<li/>"); 
        li.append(key);
        for(var j=0;j<value.length;j++){
            li.append("<p class='value'>"+value[j]+"</p>");
        }
       web_UI.append(li);
    }
}
