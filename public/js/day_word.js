var page;
requirejs(["jquery","common","/js/vendor/ejs.js"],function($,common,ejs){
	$(document).ready(function(){	
    Common.init();
		page.bindEvent();
    page.getDateList();
    if(window.innerWidth<500){
      page.toggleSideBar(1);
      page.toggleSideBar(0);
    }
  });
});

page=(function(){
  var Static={};
	function createVoice(word,callback){
		var src="/trans/get_voice/?word="+word;
		//var src="http://dict.youdao.com/dictvoice?audio="+word;
		var audio=$("<audio/>",{"controls":1,"id":word,"style":"display:none;"});
		var source=$("<source/>");
		audio.append(source);
		source[0].src=src;
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
    
    $("#large").click(function(){
      $(".wordListBox").addClass("large");
      Static.WordList.slideshow.changePage(0);
      return false;
    });

    $("#list").click(function(){
      Static.WordList.slideshow.clearTop();
      $(".wordListBox").removeClass("large");
      return false;
    });

      $("#prev").click(function(){
        Static.WordList.slideshow.changePage(-1);
        return false;
      });
      $("#next").click(function(){
        Static.WordList.slideshow.changePage(1);
        return false;
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
      side_bar.animate({"margin-left":0},500,function(){
        $("#knob i").addClass("fa-chevron-left").removeClass("fa-chevron-right");
      }); 
      side_bar.data("status",true);
      return;
    }else if(com==0){
      side_bar.animate({"margin-left":"-230px"},500,function(){
        $("#knob i").removeClass("fa-chevron-left").addClass("fa-chevron-right");
      }); 
      side_bar.data("status",false);
      return;
    }
    if(!status){
      side_bar.animate({"margin-left":0},500,function(){
        $("#knob i").addClass("fa-chevron-left").removeClass("fa-chevron-right");
      }); 
      side_bar.data("status",true);
    }else{
      side_bar.animate({"margin-left":"-230px"},500,function(){
        $("#knob i").removeClass("fa-chevron-left").addClass("fa-chevron-right");
      }); 
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
        Static.WordList.createList(ejstemp,data)
		    page.toggleSideBar(0);
        loading?loading.remove():"";
	    });
  }
  
  (function(){
    var WordList={
        slideshow:null,
        data:null
    };
      WordList.createList=function(ejstemp,data){
        $("#wordList").html("");
        for(var i=0;i<data.length;i++){
          var html=ejstemp.render({"word":data[i]});      
          var obj=$(html);
          if(i==0){obj.addClass("top")}
          this.bindEvent(obj);
          $("#wordList").append(obj);
        }
        var ss=new Static.Slideshow();
        ss.init();
        this.data=data;
        this.slideshow=ss;
      }
      WordList.bindEvent=function(obj){
        var that=this;
        var touchDir=0;
        var touchScroll=0;

          obj[0].addEventListener("touchstart",function(event){
            touchDir=event.changedTouches[0].pageY;
            touchScroll=this.scrollTop;
          },true);
         obj[0].addEventListener("touchend",function(event){
            //event.preventDefault();
            var tempY=event.changedTouches[0].pageY;
            var tempScroll=this.scrollTop-touchScroll;
            if(touchDir-tempY-tempScroll>140){
              Static.WordList.slideshow.changePage(1);
            }else if(touchDir-tempY-tempScroll<-140){
              Static.WordList.slideshow.changePage(-1);
            }
          },true);

          obj.click(function(){
            that.slideshow.activeObj=obj;
            var ow=this;
            if($(this).data("open")){
              $(this).find(".trans").slideUp(function(){
                $(ow).find(".fa-minus-square-o").addClass("fa-plus-square-o").removeClass("fa-minus-square-o");
              });
              $(this).data("open",0);
            }else{
              $(this).find(".trans").slideDown(function(){
                $(ow).find(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
              });
              $(this).data("open",1);
            };
            return false;
          });
          obj.find(".getSound").click(function(event){
            event.stopPropagation();
              var audio=createVoice(obj.find(".word").text());
              obj.append(audio);
            $("#"+$(this).attr("data-word"))[0].play();
          });
        }
    Static.WordList=WordList;
  })();



  (function(){


    function slideshow(){
      this.obj_collection=$("#wordList .one_word");
      this.activeObj=this.obj_collection.eq(0);
      this.topObj=this.activeObj;
      this.length=this.obj_collection.length;
      var that=this;
      that.reTop();
      $(window).resize(function(){
        that.reTop();
      });
    }
    slideshow.prototype.init=function(){
      var ssTag=$("#wordList");
      this.boxObj=ssTag;
      //WordList.activeObj.show();
    }
    slideshow.prototype.changePage=function(dir){
      var index=this.activeObj.index();
      if((index==0&&dir<0)||(index==this.length-1&&dir>0)){
        return;
      }
      this.activeObj=this.obj_collection.eq(index+dir);
      this.reTop();
      if(index==0&&dir<0){ return; }
      if(index==this.length-1&&dir>0){ return; }
    } 
    slideshow.prototype.reTop=function(){
      var index=this.activeObj.index();
      this.activeObj[0].scrollTop=0;
      $("#count_nav").html((1+index)+"/"+this.length);
      $("#wordList")[0].scrollTop=0;
      this.topObj.animate({"margin-top":(index)*-($("#wordList").height())+"px"},500);
    }
    slideshow.prototype.clearTop=function(){
      this.topObj.css({"margin-top":"0px"});
    }
    Static.Slideshow=slideshow;
  })();

	return {
		bindEvent:_bindEvent,
		toggleSideBar:_toggleSideBar,
    getDateList:_getDateList,
    getWordListByDate:_getWordListByDate
	}

})();
