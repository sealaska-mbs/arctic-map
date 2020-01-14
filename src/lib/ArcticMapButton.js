import React from 'react';


var style = {
    arcticButton: {
        padding: "5px",
        height: "32px",
        width: "32px",
        backgroundColor: "#fff",
        color: '#6e6e6e',
        border: 'none',
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: "#ccc"
        }
    }
}

class ArcticMapButton extends React.Component {
    static displayName = 'ArcticMapButton';

    constructor(props) {
        super(props)
        this.state = {
            enabled: true,
            useEsriIcon: props.esriicon !== null
        
        }

        this.fireclick = function (e) {
            if (this.props.onclick) {
                this.props.onclick(e);
            }
        };

    }



    render(){
        if (this.state.useEsriIcon) {

            var esriClassName = 'esri-icon esri-icon-' + this.props.esriicon;

            return(<button  style={style.arcticButton} onClick={this.fireclick.bind(this)} title={this.props.title} >
                <span style={{ height: "15px", width: "15px" }} aria-hidden className={esriClassName} ></span>
            </button>);

           
        } else {
            return (<div></div>);
        }
    }



}

export default ArcticMapButton