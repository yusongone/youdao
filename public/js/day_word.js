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
		var audio=$("<audio/>",{"controls":1,class:"audio","id":word,"style":"display:none;"});
		var source=$("<source/>");
		audio.append(source);
		source[0].src=src;
        window.aa=source[0];
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
      Static.WordList.status="large";
      $(".trans").removeAttr("style");
      Static.WordList.slideshow.changePage(0);
      return false;
    });


    $("#list").click(function(){
      Static.WordList.status="list";
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
            var li=$("<li/>",{"text":new Date(data[i].date).toISOString().substr(0,10)}).data("val",data[i].date);
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
        url:"/query/getOneDayWordList",
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
        status:"large",//default large model
        childList:[], 
        data:null
    };
      WordList.createList=function(ejstemp,data){
        $("#wordList").html("");
        for(var i=0;i<data.length;i++){
          var html=ejstemp.render({"word":data[i]});      
          var obj=$(html);
          this.childList.push(obj);
          if(i==0){obj.addClass("top")}
          this.bindEvent(obj);
          $("#wordList").append(obj);
        }
        var ss=new Static.Slideshow();
        ss.init();
        this.data=data;
        this.slideshow=ss;
      }
      WordList.childHandler=function(obj){
            if(obj.find(".trans")[0].style.display=="block"){
                obj.find(".trans").slideUp(function(){
                obj.find(".fa-minus-square-o").addClass("fa-plus-square-o").removeClass("fa-minus-square-o");
              });
                obj.data("open",0);
            }else{
                obj.find(".trans").slideDown(function(){
                obj.find(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
              });
               obj.data("open",1);
            };
            return false;
      }
      WordList.bindEvent=function(obj){
        var that=this;
        var touchDir=0;
        var touchScroll=0;
          obj[0].addEventListener("touchstart",function(event){
            if(that.status=="list"){
              return;
            }
            touchDir=event.changedTouches[0].pageY;
            touchScroll=this.scrollTop;
          },false);
        obj[0].addEventListener("touchmove",function(event){
          event.preventDefault()
        });
         obj[0].addEventListener("touchend",function(event){
            if(that.status=="list"){
              return;
            }
            //event.preventDefault();
            var tempY=event.changedTouches[0].pageY;
            var tempScroll=this.scrollTop-touchScroll;
            if(touchDir-tempY-tempScroll>140){
              Static.WordList.slideshow.changePage(1);
            }else if(touchDir-tempY-tempScroll<-140){
              Static.WordList.slideshow.changePage(-1);
            }
          },false);

          obj.click(function(){
            that.slideshow.activeObj=obj;
            if(that.status=="large"){
              return;
            }
            that.childHandler(obj);
          });

          obj.find(".star").click(function(){
            if(that.status=="list"){
              return;
            }
            var star=this;
            var count=$(this).attr("data-count");
            _createEditDiv({
                parent:star,
                count:count,
                word:$(this).attr("data-word")
              });
          });

          obj.find(".getSound").click("click",function(event){
              var btn=$(this);
              btn.text("加载...");
              var audio=createVoice(obj.find(".word").text(),function(){
                  btn.text("发音");
              });
              $(".audio").remove();
              obj.append(audio);
              $("#"+$(this).attr("data-word"))[0].play();
          });
          obj.find(".getSound").bind("touchend",function(event){
              var btn=$(this);
              btn.text("加载...");
              var audio=createVoice(obj.find(".word").text(),function(){
                  btn.text("发音");
              });
              $(".audio").remove();
              obj.append(audio);
              $("#"+$(this).attr("data-word"))[0].play();
          });
        }

    function _createEditDiv(json,callback){
      var ejstemp=new EJS({url:"/front_template/edit_star_div"});
      var html=ejstemp.render({"count":json.count});      
      var overflow=$(html);
      overflow.click(function(){
        overflow.remove();
      });
      overflow.find("i").click(function(){
        var count=$(this).index()+1;
        if($(json.parent).attr("data-count")==count){
          return false;
        };
        setStarAjax({word:json.word,count:count},function(){
                overflow.remove();
                var parent=$(json.parent);
                parent.find("i").each(function(){
                  if($(this).index()<count){
                    $(this).addClass("active");
                  }else{
                    $(this).removeClass("active");
                  }
                });
                parent.attr("data-count",count)
        });
        return false;
      });
      $("body").append(overflow);
    }
    
    function _beforeSet(json){
      $(".start_box").find("i").each(function(){
        if($(this).index()<json.count){
          $(this).addClass("fa-cog fa-spin setTemp");
        }else{
          $(this).removeClass("active setTemp fa-cog fa-spin");
        }
      });
    }

    function setStarAjax(json,callback){
      _beforeSet(json);
      $.ajax({
        "type":"post",
        "url":"/word/setStar",
        "data":{
          word:json.word,
          count:json.count
        },
        "dataType":"json"
      }).done(function(data){
        if(data.status=="ok"){
          callback();
          console.log("ok");
        }else{
          console.log("failed");
        }
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
