var Page=window.Page||{};

requirejs(["jquery","common","/js/vendor/d3.v3.min.js","/js/vendor/ejs.js"],function($,common,d3,ejs){
	$(document).ready(function(){
        Page.Controller.init({
            D3:d3
        });
  	});
});

(function(_page){

	_page.Controller={
        init:function(json){
            var d3=json.D3;
            var viewSize={
                width:800,
                height:500,
                top:10,
                bottom:10,
                right:10,
                left:10
            }
            var page=d3.select(".byDate");
            var svg=page.append("svg");
                svg.attr("viewBox","0 0 "+viewSize.width+" "+viewSize.height+" ");




            Page.Model.getTotalWord(function(data){
                drawLine(data);
            })

            function drawLine(data){
                var domainValue=d3.extent(data,function(d,b,c){
                    return d.wordList.length;
                });
                var domainDate=d3.extent(data,function(d,b,c){
                    return d.date;
                });

                var H=d3.scale.linear();
                H.domain([0,data.length]);
                H.range([50,viewSize.width-40]);

                var V=d3.scale.linear();
                V.domain([domainValue[0],domainValue[1]]);
                V.range([viewSize.height-50,10]);

                var DateScale=d3.time.scale();
                DateScale.domain([domainDate[0],domainDate[1]]);
                DateScale.range([50,viewSize.width-40]);


                var leftGroup=svg.append("g");
                var y_axis=d3.svg.axis().scale(V).orient("left");
                y_axis.tickFormat(function(a,b,c){
                    return a+"";
                });
                //y_axis.ticks(2);
                y_axis.innerTickSize(1);
                y_axis.ticks(5);
                leftGroup.call(y_axis).attr("transform", "translate(40," +viewSize.top+ ")");

                var text=leftGroup.append("text");
                text.text("(个)");
                text.attr("x",5);
                text.attr("y",25);

                var bottomGroup=svg.append("g");
                var x_axis=d3.svg.axis().scale(DateScale).orient("bottom");
                x_axis.tickFormat(function(a,b,c){
                    return d3.time.format("%Y-%m-%d")(a);
                });
                x_axis.ticks(4);
                bottomGroup.call(x_axis);
                bottomGroup.attr("transform","translate(0,"+(viewSize.height-40)+")");


                var g=svg.append("g");
                var path=g.append("path");
                path.datum(data);
                var line=d3.svg.line();
                line.x(function(a,b,c){
                    return H(b);
                });
                line.y(function(ary){
                    var count=ary.wordList.length;
                    return V(count);
                });
                path.attr("d",line);

            }

        }
	}
})(Page);

(function(_page){

    _page.Views={
    }
})(Page);

(function(_page){

    function _getTotalWord(){
        console.log(arguments.length);
        if(arguments.length==1){
            var callback=arguments[0];
        }else if(arguments.length==2){
            var jsonData=arguments[0];
            var callback=arguments[1];
        }
        $.ajax({
            url:"/query/getDateList",
            type:"post",
            dataType:"json",
        }).done(function(data){
            console.log(data);
            if(data.err_code=="0"){
                callback?callback(data.result):"";
            }else{
                alert(data.msg);
            }
        });
    };

    _page.Model={
        getTotalWord:_getTotalWord
    }
})(Page);



