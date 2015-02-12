var page;
requirejs(["jquery"],function($){
	$(document).ready(function(){	
		page.bindEvent();
  });
});

page=(function(){
	function createVoice(word,callback){
		var src="/trans/get_voice/?word="+word;
		//var src="http://dict.youdao.com/dictvoice?audio="+word;
		var audio=$("<audio/>",{"autoplay":"true","controls":1,"id":word,"style":"display:none;"});
		var source=$("<source/>");
		audio.append(source);
		source[0].src=src;
		window.ff=audio[0];
		audio[0].oncanplaythrough=function(){
			$(".icon_"+word).removeClass("fa-spinner").removeClass("fa-spin").addClass("fa-volume-up");	
			callback?callback():"";
		}
		return audio;
	}
	function _bindEvent(){
		$(".one_word").click(function(){
			var ow=this;
			if($(this).data("open")){
				$(this).find(".trans").slideUp(function(){
					$(ow).find(".fa-minus-square-o").addClass("fa-plus-square-o").removeClass("fa-minus-square-o");
				});
				$(this).data("open",0);
			}else{
				var audio=createVoice($(ow).find(".key").text());
				$(ow).append(audio);
				$(this).find(".trans").slideDown(function(){
					$(ow).find(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
				});
				$(this).data("open",1);
			};
		});
		$(".getSound").click(function(event){
			event.stopPropagation();
			$("#"+$(this).attr("data-word"))[0].play();

		});

    $("#day").click(function(){
      _getDateList();
    });

    $("#knob").click(function(){
      _toggleSideBar();
    });
    $(window).resize(function(){
      if(window.innerWidth>500){
        _toggleSideBar(0);
      }
    });

	}

  function _toggleSideBar(com){
    var side_bar=$(".side_bar");
    var status=side_bar.data("status");
    if(com==1){
      side_bar.animate({"margin-left":0},500); 
      side_bar.data("status",true);
      return;
    }else if(com==0){
      side_bar.animate({"margin-left":"-240px"},500); 
      side_bar.data("status",false);
      return;
    }
    if(!status){
      side_bar.animate({"margin-left":0},500); 
      side_bar.data("status",true);
    }else{
      side_bar.animate({"margin-left":"-240px"},500); 
      side_bar.data("status",false);
    }
  }

  function _getDateList(){
    $.ajax({
        url:"/query/getDateList",
        type:"post",
        dataType:"json",
      }).done(function(data){
          var ul=$("<ul/>",{"class":"datelist"});
          for(var i=0;i<data.length;i++){
            var li=$("<li/>",{"text":data[i].date+"--"+data[i].wordList.length});
            ul.append(li); 
          }
          $("#info_box").html("").append(ul);
	    });
  }

	return {
		bindEvent:_bindEvent,
		toggleSideBar:_toggleSideBar,
    getDateList:_getDateList
	}

})();
