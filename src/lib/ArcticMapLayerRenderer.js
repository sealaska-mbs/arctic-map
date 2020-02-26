import React from 'react';
import ReactDOM from "react-dom";

class ArcticMapLayerRenderer extends React.Component {
    static displayName = 'ArcticMapLayerRenderer';
    constructor(props) {
        super(props)
        if(props.style === undefined){
            console.log("Missing style: Build Styles @ https://developers.arcgis.com/javascript/latest/sample-code/playground/live/index.html")
        }
      
    }

   
    render() {
        return (<span></span>);
    }

}

export default ArcticMapLayerRenderer;