import React from 'react';
import { transform } from 'async';

var style = {
    bg: {
        zIndex: "100",
        position: "absolute",
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#5856569e'

    },

}
var loadingtext = {
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white'
};

class ArcticMapLoader extends React.Component {
    static displayName = 'ArcticMapLoader';
    constructor(props) {
        super(props);



    }



    render() {

        console.log(this.props);
        if (this.props.loading === true) {


            return (

                <div style={style.bg}>
                    <h1 style={loadingtext}>Working...</h1>
                </div>


            )
        }
        return null;
    }

}

export default ArcticMapLoader;