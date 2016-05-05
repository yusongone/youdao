;(function(){
    window.onload=function(){
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
                        var z=document.createElement("div");
                            z.style="width:100%;height:100%;"
                        document.getElementById("ContentBox").appendChild(z),
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

    var wordLib=(function(){
        function _getData(){

        }

        return {

        }
    })();
})();