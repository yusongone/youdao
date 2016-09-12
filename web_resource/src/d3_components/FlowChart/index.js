import * as React from "react"
import * as ReactDom from "react-dom"
import {select} from "d3-selection"
const D3={select:select}


import UIFactory from "./UIFactory"
import "./transferChart.less"


class Controller{
    _parentDOM;
    _fromData;
    _width=0;
    _height=0;
    _createOrigin=null;

    constructor(option,lineType){
        const _self=this;
        this._parentDOM=option.parentDOM;
        this._width=this._parentDOM.clientWidth;
        this._height=this._parentDOM.clientHeight;

        const svg=D3.select(this._parentDOM).append("svg");
        svg.attr("width","100%");
        svg.attr("height","100%");
        this.svg=svg;

        this.UIFactory=new UIFactory({
            svg:svg,
            parentDOM:this._parentDOM,
            lineType:lineType,
            props:option.props
        });

        window.onresize=()=>{
            "use strict";
            _self.UIFactory.rePosition();
        }
    }

    updateConfig(option){
        this.UIFactory.setLineType(option.lineType);
    }

    updateData(data){
        this.UIFactory.cleanAll();
        this._fromData=data;
        this.drawTags();
    }

    drawTags(){
        const targetFilter={};

        for(var i=0;i<this._fromData.length;i++){
            const temp=this._fromData[i];

            for(var j=0;j<temp.target.length;j++){
                const targetTemp=temp.target[j];
                targetFilter[targetTemp.key]=targetTemp;
            }
            this.UIFactory.add(temp,"from");
        }

        for(var i in targetFilter){
            this.UIFactory.add(targetFilter[i],"target");
        }

    }
}

const FlowChart=React.createClass({
    Controller:null,
    componentDidUpdate(){

    },
    componentWillReceiveProps(newProp){
        this.Controller.updateData(newProp.data);
        this.Controller.updateConfig({
            lineType:newProp.lineType
        });
    },
    componentDidMount(){
        const _self=this;

        const parent=this.refs.abc;

        this.Controller = new Controller({
            parentDOM:parent,
            lineType:this.props.lineType,
            props:this.props
        });

        this.Controller.updateData(this.props.data);

    },
    render(){
        return <div ref="abc" style={{width:"100%",height:"100%"}}></div>
    }
});

export default FlowChart;

