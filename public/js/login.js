var page;
requirejs(["jquery"],function($){
	$(document).ready(function(){	
		page.bindEvent();
	});
});

page=(function(){
	function _ajax_login(json,callback){
		$.ajax({
			type:"post",	
			url:"/login",
			data:{"id":json.id,"pass":json.pass},
			success:function(data){
				if(data.status=="ok"){
					location.href="/";
				}else{
					alert("用户名或密码错误！");
				}
			}
		});
	}
	function _bindEvent(){
		$("#loginBtn").click(function(){
			var id=$("#id").val();
			var pass=$("#pass").val();
			_ajax_login({"id":id,"pass":pass});
		});
	}
	return {
		bindEvent:_bindEvent
	}
})();
