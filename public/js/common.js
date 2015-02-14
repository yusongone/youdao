(function(factory){
  if(typeof(define)==="Function"){
    define(factory);
  }else{
    var Common=window.Common||{};
    factory(Common);
  }
  
})(function(_obj){
  window.Common=_obj;
  (function(){
    var menuBar={};
    menuBar.toggle=function(com){
      var side_bar=$(".menuBar");
      var status=side_bar.data("status");
      if(com==1){
        side_bar.animate({"top":0},500); 
        side_bar.data("status",true);
        return;
      }else if(com==0){
        side_bar.animate({"top":"-100%"},500); 
        side_bar.data("status",false);
        return;
      }
      if(!status){
        side_bar.animate({"top":0},500); 
        side_bar.data("status",true);
      }else{
        side_bar.animate({"top":"-100%"},500); 
        side_bar.data("status",false);
      }
    };
    _obj.MenuBar=menuBar;
  })();
  
  _obj.init=function(){
    $("#menu").click(function(){
      _obj.MenuBar.toggle();
    });
  }
  return _obj;
});
