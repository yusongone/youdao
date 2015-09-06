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
			url:"/auth/login",
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
	function _ajax_register(json,callback){
		$.ajax({
			type:"post",	
			url:"/auth/addUser",
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

	function _ajax_check(json){
		$.ajax({
			type:"post",
			url:"/checkUseAble",
			data:{"type":json.type,value:json.value},
		}).done(function(){

		}).complete(function(){

		});
	}

	function _bindEvent(){
		$("#loginBtn").click(function(){
			var id=$("#id").val();
			var pass=$("#pass").val();
			_ajax_login({"id":id,"pass":pass});
		});


		$("#email").blur(function(){
			var val=$(this).val();
			_ajax_check({
				type:"email",
				value:val
			});
		});

		$("#registerBtn").click(function(){
			var id=$("#id").val();
			var pass=$("#pass").val();
			var repass=$("#repass").val();
            if(pass!=repass){
                alert("密码不一致");
                return;
            }
			_ajax_register({"id":id,"pass":pass});
		});
	}

	return {
		bindEvent:_bindEvent
	}
})();
