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
                        View.Dictionary.bindQueryEvents(function(value){
                            View.Dictionary.updateQueryResult({});
                        });
                    }
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

                    }
                },
                {
                    "title":"---",
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