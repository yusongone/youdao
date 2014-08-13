var page;
requirejs(["jquery"],function($){
	$(document).ready(function(){	
		page.bindEvent();
	});
});

page=(function(){
	function _bindEvent(){
		$(".one_word").click(function(){
			var ow=this;
			if($(this).data("open")){
				$(this).find(".trans").slideUp(function(){
					$(ow).find(".fa").addClass("fa-plus-square-o").removeClass("fa-minus-square-o");
				});
				$(this).data("open",0);
			}else{
				$(this).find(".trans").slideDown(function(){
					$(ow).find(".fa").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
				});
				$(this).data("open",1);
			};
		});
	}
	return {
		bindEvent:_bindEvent
	}
})();
