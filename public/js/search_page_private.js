requirejs(["jquery"],function($){
    $(document).ready(function(){
        bindEvent();
    });
});
function bindEvent(){
    $("#searchBtn").click(function(key){
        getPathData($("#searchInput").val());
    });
}
function getaudio(world){
    var d='<audio class="wordPlay" style="width:100%;" controls=""  name="media"><source src="http://dict.youdao.com/dictvoice?audio='+world+'" type="audio/mpeg"></audio>';
    var f=$(d)[0];
    f.onended=function(){
        //$(this).remove();
    }
    $(".wordPlay").remove();
    $(".page").append(f);
}
function getPathData(val){
    $.ajax({
        url:"/getTranslateData",
        type:"post",
        data:{
            "q":val
        },
        dataType:"json",
        success:function(data){
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

