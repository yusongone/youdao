import * as React from "react"
import * as ReactDom from "react-dom"

import { PropTypes } from 'react'

import {createStore,combineReducers,compose,applyMiddleware} from "redux"
import createLogger from 'redux-logger';
import {Provider,connect} from "react-redux"

import {Router,Route,hashHistory,IndexRoute} from "react-router"

import FlowChart from "../d3_components/FlowChart"

const reducers={
    test(){
        return 1;
    }

}

const md=function(){
    return function(dispatch,getState){
        return function(next){
            return function(action){
                next(action);
            }
        }
    }
}

const store=createStore(combineReducers({...reducers}),applyMiddleware(md(),createLogger()));

store.subscribe(function(a,b,c){
    console.log("fffffffff",a,b,c);
})

setTimeout(function(){
    store.dispatch({type:"FFFFF"});

    console.log(store);
},3000);


class A extends React.Component{

    getChildContext(){
        return {te:23}
    }

    render(){
        return <div><B><C/></B><D></D></div>;
    }
}

A.childContextTypes={
    te:PropTypes.number.isRequired
}

class B extends React.Component{

    constructor(props, context) {
        super(props, context)
        this.store = props.store
    }

    getChildContext(){
        console.error("************",this.context);
        this.context.te=77;
        return this.context
    }

    render(){
        return <div>{this.props.children}</div>
    }
}
B.contextTypes={
    te:PropTypes.number.isRequired
}
B.childContextTypes={
    te:PropTypes.number.isRequired
}

class D extends React.Component{
    render(){
        console.log("DDDDDDDDDD",this.context);
        return <div>DDD</div>
    }
}
D.contextTypes={
    te:PropTypes.number.isRequired
}

class C extends React.Component{


    constructor(props, context) {
        super(props, context)
        console.log("-------------",props,context);
    }

    render(){
        console.log("props",this.context);
        return <div>123</div>
    }
}

C.contextTypes= {
    te: React.PropTypes.number.isRequired
}

console.dir(PropTypes);


React.withContext({tcc:"ssss"},function(){

    alert("fefeabc");

    ReactDom.render(<Router history={hashHistory}>
            <Route path="/" component={A}></Route>
        </Router>
        ,document.getElementById("testArea"));


});

