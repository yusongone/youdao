import * as React from "react"
import * as ReactDOM from "react-dom"


const Test=React.createClass({
    render(){
        return <div>
            <h1>123</h1>
            <h2>456</h2>
        </div>
    }
});


export default function(dom){
    ReactDOM.render(<Test/>,dom);
}