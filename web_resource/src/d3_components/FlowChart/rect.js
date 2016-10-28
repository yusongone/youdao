export default class Rect{
    body=null;
    clickHandlers=[];
    option=null;
    position=[];
    key=null;
    constructor(jsonObj){
        const _self=this;

        this.body=jsonObj.svg.append("g");
        this.body.attr("class","tag "+jsonObj.type);
        this.option=jsonObj.option;
        this.key=jsonObj.option.key;

        if(jsonObj.target){
            this.option.target=jsonObj.target;
        }


        const rect=this.body.append("rect");
        rect.attr("width",120)
            .attr("height",50)
            .attr("class","rect")
            .attr("fill","rgba(0,0,0,0.1)")
            .attr("rx",15)
            .attr("ry",15);

        const text=this.body.append("text");
        text.text(jsonObj.option.name)
            .attr("alignment-baseline","middle")
            .attr("text-anchor","middle")
            .attr("fill","#666")
            .attr("x",60)
            .attr("y",18);

        const text2=this.body.append("text");
        text2.text(jsonObj.option.value)
            .attr("alignment-baseline","middle")
            .attr("text-anchor","middle")
            .attr("fill","#999")
            .attr("x",60)
            .attr("y",38);

        if(jsonObj.hover!=false){
            this.body.on("mouseover",()=>{
                console.log("abc");
                rect.attr("stroke","rgba(0,0,0,0.3)");
                rect.attr("stroke-width","3");
            });

            this.body.on("mouseout",()=>{
                rect.attr("stroke","none");
            });
        }
        rect.on("click",()=>{
            for(var i=0;i<_self.clickHandlers.length;i++){
                _self.clickHandlers[i](jsonObj.option,jsonObj.target);
            }
        });
    }
    destroy(){
        this.body.remove();
    }
    setPosition(x,y){
        this.position=[x,y];
        this.body.style("transform","translate("+x+"px,"+y+"px)")
    }

    onClick(handler){
        this.clickHandlers.push(handler);
    }
}

