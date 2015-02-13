var page;
requirejs(["jquery","/js/vendor/ejs.js"],function($,ejs){
	$(document).ready(function(){	
		page.bindEvent();
    page.getDateList();
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
            var li=$("<li/>",{"text":data[i].date}).data("val",data[i].date);
            var span=$("<span/>",{"class":"count","text":data[i].wordList.length});
            li.append(span);
            if(i==0){
              li.addClass("active");
            }
            li.click(function(){
              $(".datelist li").removeClass("active");
              $(this).addClass("active");
              var loading=$("<i/>",{"class":"fa fa-spinner fa-spin fa-fw loading"})
              $(this).append(loading);
              page.getWordListByDate($(this).data("val"),loading);
            });
            ul.append(li); 
          }
          $("#info_box").html("").append(ul);
          page.getWordListByDate(data[0].date);
	    });
  }

  function _getWordListByDate(date,loading){
    var ejstemp=new EJS({url:"/front_template/single_word.ejs"});
    $.ajax({
        url:"/query/getWordList",
        type:"post",
        data:{
          date:date
        },
        dataType:"json",
      }).done(function(data){
        _createWordList(ejstemp,data)
		    page.toggleSideBar(0);
        loading?loading.remove():"";
	    });
  }


  function _createWordList(ejstemp,data){
      $(".showBox").html("");
    for(var i=0;i<data.length;i++){
      var html=ejstemp.render({"word":data[i]});      
      var obj=$(html);
      _oneWordEvent(obj);
      $(".showBox").append(obj);
    }
  }
  function _oneWordEvent(obj){
    obj.click(function(){
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
      return false;
    });
    obj.find(".getSound").click(function(event){
      event.stopPropagation();
      $("#"+$(this).attr("data-word"))[0].play();
    });
  }

	return {
		bindEvent:_bindEvent,
		toggleSideBar:_toggleSideBar,
    getDateList:_getDateList,
    getWordListByDate:_getWordListByDate
	}

})();
