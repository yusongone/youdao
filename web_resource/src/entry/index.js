import * as React from "react"
import * as ReactDom from "react-dom"

import {createStore,combineReducers} from "redux"
import {Provider,connect} from "react-redux"

import {Router,Route,hashHistory,IndexRoute} from "react-router"



import FlowChart from "../d3_components/FlowChart"
const CCC=connect (function(state){
    return{
        abc:state.a
    }
})(FlowChart);

const Provide=React.createClass({
    getInitialState(){
        const self=this;
        setTimeout(function(){
            self.state.data.pop();
            self.setState({
                data:self.state.data,
                lineType:"A"
            });
        },5000)

        const dic={"cognize":"认知","interest":"兴趣","buying":"购买","loyal":"忠诚","tete":"测试"};
        const data=[
                {
                    "from":{key:"cognize",value:9000},
                    "target":[
                        {"key":"interest","value":1000},
                        {"key":"buying","value":300},
                        {"key":"loyal","value":50}
                    ]
                },
                {
                    "from":{key:"interest",value:8000},
                    "target":[
                        {"key":"cognize","value":1000},
                        {"key":"buying","value":300},
                        {"key":"loyal","value":50}
                    ]
                },
                {
                    "from":{key:"buying",value:8000},
                    "target":[
                        {"key":"cognize","value":1000},
                        {"key":"interest","value":300},
                        {"key":"loyal","value":50}
                    ]
                },
                {
                    "from":{key:"loyal",value:8000},
                    "target":[
                        {"key":"cognize","value":1000},
                        {"key":"interest","value":300},
                        {"key":"tete","value":300},
                        {"key":"buying","value":50}
                    ]
                }
            ]
        for(var i=0;i<data.length;i++){
            data[i].from.name=dic[data[i].from.key]
            data[i].target.forEach((item)=>{
                item.name=dic[item.key];
            });
        }

        return {
            data:data,
            lineType:null
        }
    },
    render(){
        console.log(this.props.dispatch);
        return <div style={{width:"100%",height:"100%"}}>
            <CCC
                lineType={this.state.lineType}
                data={this.state.data}
                onClick={(data,target)=>{
                    console.log(data,target);
                }}
            ></CCC>
        </div>
    }
});


//ReactDom.render(<Provide></Provide>,document.getElementById("ContentBox"));


function mergeReducer(){
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    console.log("-----------",state);
    return {a:1,b:2}
}


const store=createStore(mergeReducer,{});

ReactDom.render(<Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Provide}></Route>
        </Router>
    </Provider>,document.getElementById("ContentBox"));
