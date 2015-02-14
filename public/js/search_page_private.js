requirejs(["jquery","common","/js/vendor/ejs.js"],function($,common,ejs){
    $(document).ready(function(){
        Common.init();
        bindEvent();
    });
});
function bindEvent(){
    $("#searchBtn").click(function(key){
        getPathData($("#searchInput").val());
    });
    $("#searchInput").focus().keydown(function(event){
        if(event.keyCode=="13"){
            getPathData($("#searchInput").val());
        }
    });
		$("body").addClass("bodyover");
}
function showMenu(action,callback){
	if(action){
		//$(".side_menu").animate({"left":"0%"});
		$(".side_menu").slideDown(function(){
		});
	}else{
		//$(".side_menu").animate({"left":"-100%"});
		$(".side_menu").slideUp(function(){
				callback();
		});
	}
}
function getaudio(world){
	var dd=$("<audio/>",{"class":"wordPlay","autoplay":"true","controls":true,"name":"media"});
	//var source=$("<source/>",{"src":"http://dict.youdao.com/dictvoice?audio="+world,"type":"audio/mpeg"})
	var source=$("<source/>",{"src":"/trans/get_voice/?word="+world,"type":"audio/mpeg"})
	//var source=$("<source/>",{"src":"/js/abc.mp3?word=","type":"audio/mpeg"})
	//var source=$("<source/>",{"src":"http://www.w3school.com.cn/i/song.mp3","type":"audio/mpeg"})
		dd.append(source);
	dd[0].onended=function(){
	}
	window.dd=dd;
    $(".wordPlay").remove();
    $("#audioBox").append(dd);
}
function getPathData(val){
    $("#searchBtn").addClass("loading").text("loading...");
    $.ajax({
        url:"/trans/getTranslateData",
        type:"post",
        data:{
            "q":val
        },
        dataType:"json",
        success:function(data){
          console.log(data);
          if(data.status=="fail"){
            alert(data.message);
            location.href="/login"
            return;
          }
          getDataSuccess();
          createList(data);
          //getaudio(val);
        }
      });
}

function getDataSuccess(){
    $("#searchInput").blur();
    $("#searchBtn").removeClass("loading").text("search");
    $(".getSound").remove();
    $(".wordPlay").remove();
    var getSound=$("<div/>",{"class":"btn getSound"});
		getSound.append("<i class='fa fa-volume-up'></i>","获取发音");
   $(".audioBox").show().append(getSound); 
   getSound.click(function(){
       $(this).remove();
       getaudio($("#searchInput").val());
   });
};

function createList(data){
    var explains_UI=$("<ul/>",{"class":"e_ui"}); 
    var web_UI=$("<ul/>",{"class":"web_ui"}); 
    var phonetic=$("<ul/>",{"class":"phonetic_ui"}); 
    $("#trans_show").html("").append(phonetic,explains_UI,web_UI);
    var explains=data.basic.explains;
    data.basic["us-phonetic"]?phonetic.append("<li>US : "+data.basic["us-phonetic"]+"</li>"):"";
    data.basic["uk-phonetic"]?phonetic.append("<li>UK : "+data.basic["uk-phonetic"]+"</li>"):"";
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

