import * as React from "react"


const C=React.createClass({
    componentDidMount(){
        console.log("---------C Did Mount");
    },
    render(){
        return <div>c</div>;
    }
});


const B=React.createClass({
    componentDidMount(){
        console.log("---------B Did Mount");
    },
    render(){
        return <div>b</div>;
    }
});




const A=React.createClass({
    getInitialState(){
        const self=this;
        this.B=<B></B>;
        this.C=<C></C>;
        console.log("init----------");
        setInterval(()=>{
            self.setState({
                abc:self.state.abc
            });

        },2000);
        return {
           abc:false
        }
    },
    componentDidMount(){
    },
    render(){
        console.log("---------render");
        return  <div>
                    <B></B>
                </div>
    },
});
export default A;