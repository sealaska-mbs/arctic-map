import React from 'react';
import ReactDOM from "react-dom";

class ArcticMapControlArea extends React.Component {
    static displayName = 'ArcticMapControlArea';
    constructor(props) {
        super(props)
        this.controlNode = document.createElement("div");
        this.props.view.ui.add(this.controlNode, this.props.location);
    }

    componentDidUpdate(){
        if (this.controlNode) {
            ReactDOM.render(this.widgetRender(), this.controlNode);
        }
    }

    widgetRender() {
        return (<span className='arcticmap-area'>{this.props.children}</span>)
    }
    render(){
        return(<span></span>);
    }

}

export default ArcticMapControlArea;