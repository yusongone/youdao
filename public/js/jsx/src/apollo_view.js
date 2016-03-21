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

        var resultsBoard=React.createClass({
            getInitialState:function(){
                return {
                    abc:"234"
                }
            },
            render:function(){
                return <div className="queryResults" >
                    {this.state.abc}
                    <div id="trans_show" class="trans_show">
                        <ul class="phonetic_ui">
                            <li>[ us : tɛst ]</li>
                            <li>[ uk : test ]</li>
                        </ul>
                        <ul class="e_ui">
                            <li>n. 试验；检验</li>
                            <li>vt. 试验；测试</li>
                            <li>vi. 试验；测试</li>
                            <li>n. (Test)人名；(英)特斯特</li>
                        </ul>
                        <ul class="web_ui">
                            <li>
                                <span class="key">Test</span>
                                <p class="value">测试</p>
                                <p class="value">测验</p>
                                <p class="value">检验</p>
                            </li>
                            <li>
                                <span class="key">DROP TEST</span>
                                <p class="value">跌落测试</p>
                                <p class="value">跌落试验</p>
                                <p class="value">坠落试验</p>
                            </li>
                            <li>
                                <span class="key">test case</span>
                                <p class="value">测试用例</p>
                                <p class="value">测试案例</p>
                                <p class="value">测试个案</p>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        });

        var Box=React.createClass({
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
                return <div className="dictionary_area">
                    {this.state.abc}
                            <input value={self.state.inputValue} onKeyPress={self._keyPress} onChange={self._onChange} />
                            <resultsBoard></resultsBoard>
                        </div>
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
                ReactDOM.render(<Box Event={Event} ></Box>,options.parentDOM);
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
            var _top=React.createClass({
                render:function(){

                    return <div>123</div>
                }
            });
            return {
                init:function(options){
                    ReactDOM.render(<_top></_top>,options.parentDOM);
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
            var Child=React.createClass({
                _click:function(handler){
                    handler?handler():"";
                },
                render:function(){
                    var self=this,
                        data=this.props.data;
                    return <li
                        key={data.title}
                        className="child_li"
                        onClick={
                            (function(){
                                var handler=data.onClick;
                                return function(){self._click(handler)}
                                })()
                            }
                    >{data.title}</li>
                }
            });

            var Item=React.createClass({
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
                        statusIcon=<i className={statusIconClassVeriable}></i>
                        var childsAry=data.childs.map(function(item){
                            return <Child data={item} key={item.title}></Child>;
                        });
                        childsDOM = <ul className={childListClassNameVariable}>{childsAry}</ul>
                    }else{
                        statusIcon = "";
                        childsDOM = "";
                    }

                    return <li key={data.title} className="parent_li" >
                        <div
                            className="title"
                            onClick={
                                (function(){
                                    var clickHandler=data.onClick;
                                    return function(Event){self._click(clickHandler)}
                                })()
                            }
                        >
                            {data.title}
                            {statusIcon}
                        </div>
                        {childsDOM}
                    </li>;
                }
            });
            var Box=React.createClass({
                render:function(){
                    var RAry=this.props.nodesData.map(function(item){
                        return <Item data={item} key={item.title}></Item>;
                    });
                    return <ul className="nav">{RAry}</ul>;
                }
            });

            ReactDOM.render(<Box nodesData={options.nodesData}></Box>,options.parentDOM);
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



