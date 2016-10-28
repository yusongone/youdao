define(["apollo_view"],function(View){

   return {
       main:_main
   }

    function _main(){

        var content=document.getElementById("ContentBox");

        function getContextSize(){
            return{
                width:content.offsetWidth,
                height:content.offsetHeight
            }
        }

        window.onresize=function(){
            getContextSize();
        };
        View.Plugins.Collapse.init({
            parentDOM:document.getElementById("SideBarContent"),
            nodesData:[
                {
                    "title":"词典",
                    "onClick":function(){
                        View.Dictionary.show({
                            parentDOM:document.getElementById("ContentBox"),
                        });
                    },
                },
                {
                    "title":"记事本"
                },
                {
                    "title":"单词库",
                    "childs": [{
                        title: "全部",
                        onClick: function () {
                            View.WordLibBox.show({
                                parentDOM:document.getElementById("ContentBox")
                            });
                        }
                    },{
                        title: "一周",
                    },{
                        title: "一天",
                    }],
                    onClick: function () {

                    }
                },
                {
                    "title":"分析",
                    onClick: function () {
                        var contentBox=document.getElementById("ContentBox");
                            contentBox.innerHTML="";
                        var z=document.createElement("div");
                            z.style="width:100%;height:300px;"
                            contentBox.appendChild(z),

                        View.Analyze.show({
                            parentDOM:z
                        });
                    },
                    onMount:function(){
                        this.onClick();
                    }
                },
                {
                    "title":"设置",
                    "childs": [{
                        title: "个人信息",
                        onClick: function () {
                            View.WordLibBox.show({
                                parentDOM:document.getElementById("ContentBox")
                            });
                        }
                    }, {
                        title: "Kindle",
                    },{
                        title: "密码",
                    }],
                }
            ]
        });
    };
});