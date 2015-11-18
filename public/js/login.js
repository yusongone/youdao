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
					alert(data.status);
				}
			}
		});
	}
	function _ajax_register(json,callback){
		$.ajax({
			type:"post",	
			url:"/auth/register",
			data:{
				"username":json.username,
				"pass":json.pass,
				"email":json.email,
				"captcha":json.captcha
			},
			success:function(data){
				if(data.status){
					alert("注册成功，请登录您的邮件激活账号！");
					//location.href="/";
				}else{
					alert(data.msg);
				}
			}
		});
	}

	function _ajax_check(json){
		$.ajax({
			type:"post",
			url:"/auth/checkTypeAble",
			data:{"type":json.type,value:json.value},
		}).done(function(data){
			switch(json.type){
				case "email":
					if(data.status==true){
						$(".emailCheck").css({display:"inline-block"});
						$(".emailAlert").css({display:"none"});
					}else{
						$(".emailCheck").css({display:"none"});
						if(data.msg=="Please use the correct Email!"){
							$(".emailAlert").css({display:"inline-block"}).text("邮件格式不正确!");
						}else{
							$(".emailAlert").css({display:"inline-block"}).text("已经注册过!");
						}
					}
					break;
				case "name":
					if(data.status==true){
						$(".usernameCheck").css({display:"inline-block"});
						$(".usernameAlert").css({display:"none"});
					}else{
						$(".usernameCheck").css({display:"none"});
						$(".usernameAlert").css({display:"inline-block"}).text("已经注册过!");
					}


					break;
			}
			console.log(data);
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
		$("#username").blur(function(){
			var val=$(this).val();
			_ajax_check({
				type:"name",
				value:val
			});
		});

		$("#registerBtn").click(function(){
			var requestData={};
			requestData.email=$("#email").val();
			requestData.username=$("#username").val();
			requestData.pass=$("#pass").val();
			requestData.repass=$("#repass").val();
			requestData.captcha=$("#captcha").val();
            if(requestData.pass!=requestData.repass){
                alert("密码不一致");
                return;
            }
			for(var i in requestData){
				if(!requestData[i]&&i!="repass"){
					alert(i+"不能为空!");
					return;
				}
			}
			_ajax_register(requestData);
		});
	}

	return {
		bindEvent:_bindEvent
	}
})();
