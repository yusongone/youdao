define([],function(){
    var resizeFilter,originData;
    var viewArea, width, height, splitData, xScale,runChartLine, xAxis, yAxis, yScale, xDomain, yDomain;
    var oldXScale,oldYScale;
    var leftRulerWidth=50,bottomRulerHeight=30;

    var splitBegin;
    var splitLength=30;


    function Axis(options){
        this.axisDOM=viewArea.append("g");
        this.axisDOM.attr(options.attrs);
        this.position=options.position;
        this.axisDOM.attr("transform","translate("+this.position()[0]+","+this.position()[1]+")");
        var _axis=d3.svg.axis();
        _axis.orient(options.orient);
        _axis.tickFormat(options.tickFormat);
        _axis.outerTickSize([1])
        options.ticks&&_axis.ticks(options.ticks);
        this.axis=_axis;
        this.update(options.scale);
    }
    Axis.prototype.resize=function(scale){
        this.update(scale);
        this.axisDOM.attr("transform","translate("+this.position()[0]+","+this.position()[1]+")");
    }
    Axis.prototype.update=function(scale){
        this.axis.scale(scale);
        this.axisDOM.transition().duration(1000).call(this.axis);
    }


    var LineFactroy=(function(){
        var lineBox;
        var oldData;

        function Line(){
            var line=d3.svg.line();
            line.x(function(item,index){
                return xScale(new Date(item.date));
            });
            line.y(function(item,index){
                return yScale(item.wordList.length);
            });

            var defs=lineBox.append("defs");
            var mask=defs.append('clipPath')
                mask.attr("id","abc");
                lineBox.attr("clip-path","url(#abc)");
            var rect=mask.append("rect")
                .attr('width',width-leftRulerWidth)
                .attr('height', height-bottomRulerHeight)
                .attr('x', 0)
                .attr('y', 0)

            oldData=splitData.concat([]);
            var path=lineBox.append("path");
            path.datum(splitData);
            path.attr("d",line);
            path.attr({
                "fill":"none",
                "stroke":"red",
                "stroke-width":"1px",
            });



            this.path=path;
            this.line=line;
        }

        Line.prototype.getSideScale=function(){

            var line=d3.svg.line();
            line.x(function(item,index){
                return oldXScale(new Date(item.date));
            });
            line.y(function(item,index){
                return oldYScale(item.wordList.length);
            });

            return line;
        }

        Line.prototype.update=function(dir){
            var self=this;
            var tempLine=self.getSideScale();
            if(dir>0){
                var tempData=oldData.concat(splitData);
            }else{
                var tempData=splitData.concat(oldData);
            }
            self.path.datum(tempData);
            self.path.attr("d",tempLine);

            this.path.transition().duration(1000).attr("d",this.line).each("end",function(){
                self.path.datum(splitData);
                oldData=splitData.concat([]);
            });
            return;
        }

        Line.prototype.update1=function(){
            var self=this;
            this.path.datum(oldData);
            this.path.transition().duration(1000).attr("d",this.line).each("end",function(){
                self.path.datum(splitData);
                self.path.attr("d",self.line);
                oldData=splitData.concat([]);
            });
        }

        return {
            init:function(){
                lineBox=viewArea.append("g");
                lineBox.attr("transform","translate("+leftRulerWidth+","+0+")");
            },
            addLine:function(){
                return new Line();
            }
        }
    })();





    function _renderRuler(){
        xAxis=new Axis({
            orient:"bottom",
            scale:xScale,
            ticks:5,
            tickFormat:function(item){
                return d3.time.format("%Y-%m-%d")(item);
            },
            position:function(){
                return [leftRulerWidth,height-bottomRulerHeight];
            },
            attrs:{
                "shape-rendering":"crispEdges",
                "fill-width":"1px",
                "stroke":"none",
                "fill":"#999",
                "class":"xAxis"
            }
        });

        yAxis=new Axis({
            orient:"left",
            scale:yScale,
            ticks:8,
            position:function(){
                return [leftRulerWidth,0];
            },
            tickFormat:function(item){
                return item;
            },
            attrs:{
                "shape-rendering":"crispEdges",
                "fill-width":"1px",
                "stroke":"none",
                "fill":"#999",
                "class":"yAxis"
            }
        });

    }

    function computeScale(){
        xDomain=d3.extent(splitData,function(item){
            return new Date(item.date);
        });

        yDomain=d3.extent(splitData,function(item){
            return item.wordList.length;
        });
        if(xScale){
            oldXScale=xScale;
        }
        if(yScale){
            oldYScale=yScale;
        }

        xScale=d3.time.scale();
        xScale.domain(xDomain);
        xScale.rangeRound([0,width-leftRulerWidth]);

        yScale=d3.scale.linear();
        yScale.domain(yDomain);
        yScale.rangeRound([height-bottomRulerHeight,0]);
    }

    function bindKeyboardEvent(){

        var tempData=originData.concat([]);
        splitData=tempData.splice(splitBegin,splitLength);
        d3.select(document).on("keyup",function(event){
            if( d3.event.keyCode<37||d3.event.keyCode>40){return;}
            var dir=0;
            switch( d3.event.keyCode ){
                case 37://  <-
                    splitBegin-=splitLength;
                    dir=-1;
                    break;
                case 39:;// ->
                    splitBegin+=splitLength;
                    dir=1;
                    break;
                case 38:// up
                    dir=1;
                    splitLength++;
                    return;
                    break;
                case 40:// up
                    dir=1;
                    return;
                    break;
            };

            var tempData=originData.concat([]);
            splitData=tempData.splice(splitBegin,splitLength);
            computeScale();
            xAxis.update(xScale);
            yAxis.update(yScale);
            runChartLine.update(dir);
        });
    }

    return {
        init:function(options){

            width=options.width;
            height=options.height;


            originData=options.data;
            for(var i=0;i<originData.length;i++){
                originData[i].index=i;
            }

            splitBegin=originData.length-31;
            var tempData=originData.concat([]);
            splitData=tempData.splice(splitBegin,splitLength);

            var parentDOM=options.parentDOM;
            viewArea=d3.select(parentDOM).append("svg");
            viewArea.attr("viewBox","0,0,"+width+","+height);

            LineFactroy.init();
            computeScale();
            _renderRuler();
            runChartLine=LineFactroy.addLine();

            bindKeyboardEvent();

            d3.select(parentDOM).on("click",function(){
            });
            /*
             */
        },
        reSize:function(_width,_height){
            if(width==_width&&height==height){return;}
            width=_width;
            height=_height;
            viewArea.attr("viewBox","0,0,"+width+","+height);
            if(resizeFilter){
                clearTimeout(resizeFilter);
            }
            resizeFilter=setTimeout(function(){
                computeScale();
                xAxis.resize(xScale);
                yAxis.resize(yScale);
                runChartLine.update1();
            },500);
        }
    }
});

