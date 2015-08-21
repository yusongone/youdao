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
    var url,type;
        var str= val;
        var checkAry=str.match(/[\u3400-\u9FBF]/);
        if(checkAry&&checkAry.length>0){
            //get data from youdao
            url="http://fanyi.youdao.com/openapi.do";
            type="GET";
        }else{
            //get data from makejs
            url="http://www.makejs.com/trans/getTranslateData";
            type="POST";
        }

    $.ajax({
        url:url,
        type:type,
        data:{
            "keyfrom":"makejs",
            "key":"1081520201",
            "type":"data",
            "doctype":"json",
            "version":"1.1",
            "q":val,
            "deviceType":2
        },
        datatype:"JSON",
        success:function(data){
            console.log(data);
            createList(data);
            //getaudio(val);
            }
        });
}
function createList(data){
    var explains_UI=$("<ul/>",{"class":"e_ui"}); 
    var web_UI=$("<ul/>",{"class":"web_ui"});

    var phonetic_ui=$("<ul/>",{"class":"phonetic_ui"});
    if(data.basic){
        var basic=data.basic;
        var explains=basic.explains;
        $("#trans_show").html("").append(phonetic_ui,explains_UI,web_UI);
        if(basic["us-phonetic"]){
            var li="<li>[ us : "+basic['us-phonetic'] +"]</li>";
            phonetic_ui.append(li);
        }
        if(basic["uk-phonetic"]){
            var li="<li>[ uk : "+basic['uk-phonetic'] +"]</li>";
            phonetic_ui.append(li);
        }

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
    }else{
      $("#trans_show").html("<span class='sorry'> 没有找到翻译.</span>");
    }
}
