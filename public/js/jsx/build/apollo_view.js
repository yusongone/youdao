;(function(factory){
    if(typeof(define)==="function"){

    }else{
        window.View=Window.View||{};
        factory(window.View);
    }
})(function(_view){
    var View=_view||{};

    var _Dictionary=(function(){
        var _queryEvents=[];
        var queryConect=null;


        var Event={
            _handlers:{},
            bind:function(action,handler){
                if(!this._handlers[action]){
                    this._handlers[action]=[];
                }
                this._handlers[action].push(handler);
            },
            fire:function(action,arg){
                for(var i=0;i<this._handlers[action].length;i++){
                    this._handlers[action][i].apply(this,arg);
                }
            }
        }

        function queryFromServer(val){
            //var data={"translation":["测试"],"basic":{"us-phonetic":"tɛst","phonetic":"test","uk-phonetic":"test","explains":["n. 试验；检验","vt. 试验；测试","vi. 试验；测试","n. (Test)人名；(英)特斯特"]},"query":"test","errorCode":0,"web":[{"value":["测试","测验","检验"],"key":"Test"},{"value":["跌落测试","跌落试验","坠落试验"],"key":"DROP TEST"},{"value":["测试用例","测试案例","测试个案"],"key":"test case"}]};
            queryConect=$.ajax({
                url:"/trans/getTranslateData",
                type:"post",
                data:{
                    "q":val,
                    "deviceType":0
                },
                dataType:"json",
            }).done(function(data){
                if(data.status=="fail"){
                    alert(data.message);
                    location.href="/auth/login"
                    return;
                }else{
                    Event.fire("updateState",[data]);
                }
            });
        }

        var ResultsBoard=React.createClass({displayName: "ResultsBoard",
            componentWillMount:function(){
                var self=this;
                Event.bind("updateState",function(json){
                    console.log(json);
                    self.setState(json);
                });
            },
            getInitialState:function(){
                return {
                    abc:"234"
                }
            },
            render:function(){
                var e_ui="",
                    web_ui="";

                if(this.state.basic&&this.state.basic.explains) {
                    e_ui = this.state.basic.explains.map(function (item) {
                        return React.createElement("li", {key: item}, item)

                    });
                }else{
                    return React.createElement("div", null);
                }

                if(this.state.web) {
                    web_ui= this.state.web.map(function (item,index) {
                        var temp=item.value.map(function(item2,index2){
                            return React.createElement("p", {key: index2, className: "value"}, item2)
                        });
                        console.log(item,index);
                        return React.createElement("li", {key: index}, React.createElement("span", {className: "key"}, item.key), temp)
                    });
                }
                return React.createElement("div", {className: "query_results_box"}, 
                    React.createElement("div", {id: "trans_show", className: "trans_show"}, 
                        React.createElement("ul", {className: "phonetic_ui"}, 
                            React.createElement("li", null, this.state.basic?(this.state.basic["uk-phonetic"]||""):""), 
                            React.createElement("li", null, this.state.basic?(this.state.basic["us-phonetic"]||""):"")
                        ), 
                        React.createElement("ul", {className: "e_ui"}, 
                            e_ui
                        ), 
                        React.createElement("ul", {className: "web_ui"}, 
                            web_ui
                        )
                    )
                )
            }
        });

        var Box=React.createClass({displayName: "Box",
            componentWillMount:function(){
            },
            getInitialState:function(){
               return {
                   inputValue:"fe"
               }
            },
            _onChange:function(events){
                this.state.inputValue=events.target.value;
                this.setState(this.state);
            },
            _keyPress:function(event){
                var self=this;
                if(event.key=="Enter"){
                    queryFromServer(this.state.inputValue);
                };
            },
            render:function(){
                var self=this;
                var bingUrl="http://cn.bing.com/dict/?q="+self.state.inputValue;
                return React.createElement("div", {className: "dictionary_area"}, 
                            React.createElement("div", {className: "tools_box"}, 
                                React.createElement("input", {className: "search_input", value: self.state.inputValue, onKeyPress: self._keyPress, onChange: self._onChange}), 
                                React.createElement("i", {className: "fa fa-search search_btn"}), 
                                React.createElement("a", {target: "_blank", className: "bing_link", href: bingUrl}, "Bing:", self.state.inputValue)
                            ), 
                            React.createElement(ResultsBoard, null)
                        )
            }
        });


        return {
            show:function(options){
                ReactDOM.render(React.createElement(Box, null),options.parentDOM);
            },
            bindQueryEvents:function(handler){
                _queryEvents.push(handler);
            },
            updateQueryResult:function(jsonData){
                Event.fire("updateInfo",[{"abc":"what the fuck"}]);
            }
        }
    })();

    var _wordLibBox=(function(){
        var TopBar=(function(){
            var _top=React.createClass({displayName: "_top",
                render:function(){

                    return React.createElement("div", null, "123")
                }
            });
            return {
                init:function(options){
                    ReactDOM.render(React.createElement(_top, null),options.parentDOM);
                }
            }
        })();
        return {
            show:function(options){
                TopBar.init(options);
            }
        }
    })();


    var _Collapse=(function(){

        function CollapseObject(options){
            var Child=React.createClass({displayName: "Child",
                _click:function(handler){
                    handler?handler():"";
                },
                render:function(){
                    var self=this,
                        data=this.props.data;
                    return React.createElement("li", {
                        key: data.title, 
                        className: "child_li", 
                        onClick: 
                            (function(){
                                var handler=data.onClick;
                                return function(){self._click(handler)}
                                })()
                            
                    }, data.title)
                }
            });

            var Item=React.createClass({displayName: "Item",
                getInitialState:function(){
                    return {
                        status:false,
                        childListClassVariable:"closed",
                        statusIconClassVeriable:"fa-angle-down",
                    }
                },
                _click:function(clickHandler){
                    this.state.status=!this.state.status;
                    this.state.childListClassVariable=this.state.status?"opened":"closed";
                    this.state.statusIconClassVeriable=this.state.status?"fa-angle-up":"fa-angle-down";
                    this.setState(this.state);
                    clickHandler?clickHandler():"";
                },
                componentDidMount:function(){
                    var data=this.props.data;
                    data.onMount?data.onMount():"";
                },
                render:function(){
                    var self=this;
                    var data=this.props.data;
                    var statusIconClassVeriable="fa "+this.state.statusIconClassVeriable+" state_icon";
                    var childListClassNameVariable="childs "+this.state.childListClassVariable;

                    var childsDOM,
                        statusIcon;
                    if(data.childs&&data.childs.length>0){
                        statusIcon=React.createElement("i", {className: statusIconClassVeriable})
                        var childsAry=data.childs.map(function(item){
                            return React.createElement(Child, {data: item, key: item.title});
                        });
                        childsDOM = React.createElement("ul", {className: childListClassNameVariable}, childsAry)
                    }else{
                        statusIcon = "";
                        childsDOM = "";
                    }

                    return React.createElement("li", {key: data.title, className: "parent_li"}, 
                        React.createElement("div", {
                            className: "title", 
                            onClick: 
                                (function(){
                                    var clickHandler=data.onClick;
                                    return function(Event){self._click(clickHandler)}
                                })()
                            
                        }, 
                            data.title, 
                            statusIcon
                        ), 
                        childsDOM
                    );
                }
            });
            var Box=React.createClass({displayName: "Box",
                render:function(){
                    var RAry=this.props.nodesData.map(function(item){
                        return React.createElement(Item, {data: item, key: item.title});
                    });
                    return React.createElement("ul", {className: "nav"}, RAry);
                }
            });

            ReactDOM.render(React.createElement(Box, {nodesData: options.nodesData}),options.parentDOM);
        }

        return {
            init:function(options){
                return new CollapseObject(options);
            }
        }
    })();



    View.Plugins={
        Collapse:_Collapse
    }
    View.Dictionary=_Dictionary;
    View.WordLibBox=_wordLibBox;

    return View;
});



