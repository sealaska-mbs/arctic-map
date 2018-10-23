import React from "react";


import {
    loadModules
} from 'react-arcgis';

class ArcticMapLayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            map: props.map,
            view: props.view,
            graphic: null
        };
    }

    componentWillUnmount() {
        this.props.view.graphics.remove(this.state.graphic);
    }

    componentWillMount() {
        var self = this;
        loadModules(['esri/Graphic',
            "esri/layers/FeatureLayer",
            "esri/layers/MapImageLayer",
            "esri/layers/ImageryLayer"
        ]).then(([
            Graphic,
            FeatureLayer,
            MapImageLayer,
            ImageryLayer
        ]) => {
            // Create a polygon geometry


            // this.setState({ graphic });

            if (self.props.type === "feature") {

                var featureLayer = new FeatureLayer({
                    url: self.props.src
                });

                self.state.map.add(featureLayer);
            }

            if (self.props.type === "dynamic") {

                var layer = new MapImageLayer({
                    url: self.props.src
                });

                self.state.map.add(layer);
            }


            if (self.props.type === "image") {


                var layer = new ImageryLayer({
                    url: self.props.src,
                    format: "jpgpng" // server exports in either jpg or png format
                });

                self.state.map.add(layer);

            }

            //this.state.view.graphics.add(graphic);
        }); //.catch ((err) => console.error(err));
    }


    render() {
        return null;
    }


}

export default ArcticMapLayer;