;(function(factory){
    if(typeof(define)==="function"){
        define(["react","react-dom","chart"],factory);
    }else{
        window.View=Window.View||{};
        factory(window.View);
    }
})(function(React,ReactDOM,Chart){
    var View=window._view||{};

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

        var ResultsBoard=React.createClass({
            componentWillMount:function(){
                var self=this;
                Event.bind("updateState",function(json){
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
                        return <li key={item}>{item}</li>

                    });
                }else{
                    return <div></div>;
                }

                if(this.state.web) {
                    web_ui= this.state.web.map(function (item,index) {
                        var temp=item.value.map(function(item2,index2){
                            return <p key={index2} className="value">{item2}</p>
                        });
                        return <li key={index}><span className="key">{item.key}</span>{temp}</li>
                    });
                }
                return <div className="query_results_box" >
                    <div id="trans_show" className="trans_show">
                        <ul className="phonetic_ui">
                            <li>{this.state.basic?(this.state.basic["uk-phonetic"]||""):""}</li>
                            <li>{this.state.basic?(this.state.basic["us-phonetic"]||""):""}</li>
                        </ul>
                        <ul className="e_ui">
                            {e_ui}
                        </ul>
                        <ul className="web_ui">
                            {web_ui}
                        </ul>
                    </div>
                </div>
            }
        });

        var Box=React.createClass({
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
                return <div className="dictionary_area">
                            <div className="tools_box">
                                <input className="search_input" value={self.state.inputValue} onKeyPress={self._keyPress} onChange={self._onChange} />
                                <i className="fa fa-search search_btn"></i>
                                <a target="_blank" className="bing_link" href={bingUrl}>Bing:{self.state.inputValue}</a>
                            </div>
                            <ResultsBoard></ResultsBoard>
                        </div>
            }
        });


        return {
            show:function(options){
                ReactDOM.render(<Box></Box>,options.parentDOM);
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
                alert();
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

    var _Analyze=(function(){
        var _Http=(function(){
            var queryAllDetailData;

            function _getAllDetailData(jsonData,callback){
                queryAllDetailData=$.ajax({
                    url:"/query/getDateList",
                    type:"post",
                    data:{},
                    dataType:"json",
                }).done(function(data){
                    if(data.status=="fail"){
                        return;
                    }else{
                        if(data.err_code==0){
                            callback(data.result);
                        }
                    }
                });
            }

            return {
                getAllDetailData:_getAllDetailData,
            }
        })();




        return {
            show:function(options){
                options.width=options.width||options.parentDOM.offsetWidth,
                options.height=options.height||options.parentDOM.offsetHeight;
                options.parentDOM.innerHTML="";

                _Http.getAllDetailData({},function(data){
                    options.data=data;
                    Chart.init(options);
                });

                window.onresize=function(){
                    var width=options.parentDOM.offsetWidth,
                        height=options.parentDOM.offsetHeight;
                        Chart.reSize(width,height);
                }
            }
        }
    })();



    View.Plugins={
        Collapse:_Collapse
    }
    View.Dictionary=_Dictionary;
    View.WordLibBox=_wordLibBox;
    View.Analyze=_Analyze;

    return View;
});



