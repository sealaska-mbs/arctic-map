import React from 'react';
class ArcticMapLayerPopup extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        
        return <span></span>;

    }

    renderPopup(context){
        if(this.props.popup){
            return this.props.popup(context);
        }
    }

}


export default ArcticMapLayerPopup;