requirejs(["jquery","common","/js/vendor/ejs.js"],function($,common,ejs){
    $(document).ready(function(){
      Common.init();
      bindEvent();
    });
});

function bindEvent(){
  $("#searchBtn").click(function(){
      trans();
      return false;
  });
  $("#searchInput").keydown(function(event){
    if(event.keyCode==13){
      trans();
      return false;
    }
  });
  function trans(){
    var origin_text=" "+$("#searchInput").text()+" ";
    text=origin_text.replace(/,/g," , ");
    text=text.replace(/\./g," . ");
    text=text.replace(/\;/g," ; ");
    text=text.replace(/\'/g," ' ");
    text=text.replace(/\"/g,' " ');
    var ary = getClearWord(text);
    for(var i = 0; i < ary.length; i++){
      var a=ary[i];
      var Rex=new RegExp(" "+a+" ","g");
      text=text.replace(Rex," {"+a+"} ");
    }
      text=text.replace(/{/g,"<strong>");
      text=text.replace(/}/g,"</strong>");
    $("#searchInput")[0].innerHTML=text;
    $("#searchInput").find("strong").click(function(){
      $("#searchInput").find("strong").removeClass("big");
      $(this).addClass("big");
      var word=$(this).text();
      getData(word,origin_text);
    });
  }
}

function Trim(text){
  var space_32=String.fromCharCode(32);
  var space_160=String.fromCharCode(160);
  var rex=new RegExp(space_160,"g");
  if(text.indexOf(space_160+space_160)>-1){
    text=text.replace(rex," ");
    Trim(text);
  }
  return text;
}

function getClearWord(text){
    var basicAry=text.split(",");
    var ary=[];
    for(var i=0;i<basicAry.length;i++){
      var tempAry=basicAry[i].split(" ");
      for(var j=0;j<tempAry.length;j++){
        var space_32=String.fromCharCode(32);
        var space_160=String.fromCharCode(160);
        if(tempAry[j]&&tempAry[j]!="."&&tempAry[j]!=space_32&&(tempAry[j]!=space_160)){
          ary.push(tempAry[j]);
        }
      }
    }
    window.ary=ary;
    return ary;
}

function Word(){
    
}
Word.prototype.intUI=function(text){
  var d=$("<li/>",{"text":text});
  return d;
}


function getData(val,sentence){
    $.ajax({
        url:"/trans/getTranslateData",
        type:"post",
        data:{
            "q":val,
            "sentence":sentence
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
