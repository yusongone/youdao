;(function(){
    window.onload=function(){
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
                                parentDOM:document.getElementById("ContentBox"),
                            });
                        }
                    },{
                        title: "一周",
                    },{
                        title: "一天",
                    }],
                    onClick: function () {

                    },
                    onMount:function(){
                        this.childs[0].onClick();
                    }
                },
                {
                    "title":"分析",
                },
                {
                    "title":"设置",
                    "childs": [{
                        title: "个人信息",
                        onClick: function () {
                            View.WordLibBox.show({
                                parentDOM:document.getElementById("ContentBox"),
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