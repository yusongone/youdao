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

        var resultsBoard=React.createClass({displayName: "resultsBoard",
            getInitialState:function(){
                return {
                    abc:"234"
                }
            },
            render:function(){
                return React.createElement("div", {className: "queryResults"}, 
                    this.state.abc, 
                    React.createElement("div", {id: "trans_show", class: "trans_show"}, 
                        React.createElement("ul", {class: "phonetic_ui"}, 
                            React.createElement("li", null, "[ us : tɛst ]"), 
                            React.createElement("li", null, "[ uk : test ]")
                        ), 
                        React.createElement("ul", {class: "e_ui"}, 
                            React.createElement("li", null, "n. 试验；检验"), 
                            React.createElement("li", null, "vt. 试验；测试"), 
                            React.createElement("li", null, "vi. 试验；测试"), 
                            React.createElement("li", null, "n. (Test)人名；(英)特斯特")
                        ), 
                        React.createElement("ul", {class: "web_ui"}, 
                            React.createElement("li", null, 
                                React.createElement("span", {class: "key"}, "Test"), 
                                React.createElement("p", {class: "value"}, "测试"), 
                                React.createElement("p", {class: "value"}, "测验"), 
                                React.createElement("p", {class: "value"}, "检验")
                            ), 
                            React.createElement("li", null, 
                                React.createElement("span", {class: "key"}, "DROP TEST"), 
                                React.createElement("p", {class: "value"}, "跌落测试"), 
                                React.createElement("p", {class: "value"}, "跌落试验"), 
                                React.createElement("p", {class: "value"}, "坠落试验")
                            ), 
                            React.createElement("li", null, 
                                React.createElement("span", {class: "key"}, "test case"), 
                                React.createElement("p", {class: "value"}, "测试用例"), 
                                React.createElement("p", {class: "value"}, "测试案例"), 
                                React.createElement("p", {class: "value"}, "测试个案")
                            )
                        )
                    )
                )
            }
        });

        var Box=React.createClass({displayName: "Box",
            componentWillMount:function(){
                var self=this;
                this.props.Event.bind("updateInfo",function(json){
                    self.setState(json);
                });
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
                    _queryEvents.map(function(item){
                        item.call(self,self.state.inputValue);
                    });
                };
            },
            render:function(){
                var self=this;
                return React.createElement("div", {className: "dictionary_area"}, 
                    this.state.abc, 
                            React.createElement("input", {value: self.state.inputValue, onKeyPress: self._keyPress, onChange: self._onChange}), 
                            React.createElement("resultsBoard", null)
                        )
            }
        });

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

        return {
            show:function(options){
                ReactDOM.render(React.createElement(Box, {Event: Event}),options.parentDOM);
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



