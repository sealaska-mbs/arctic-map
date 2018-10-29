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
            "esri/layers/ImageryLayer",
            "esri/tasks/IdentifyTask",
            "esri/tasks/support/IdentifyParameters"
        ]).then(([
            Graphic,
            FeatureLayer,
            MapImageLayer,
            ImageryLayer,
            IdentifyTask,
            IdentifyParameters
        ]) => {
            // Create a polygon geometry

          
            self.identifyTask = new IdentifyTask(self.props.src);
            self.params = new IdentifyParameters();
            self.params.tolerance = 3;
            //self.params.layerIds = [0, 1, 2];
            self.params.layerOption = "top";
            self.params.width = self.state.view.width;
            self.params.height = self.state.view.height;

            // this.setState({ graphic });

            if (self.props.type === "feature") {

                var featureLayer = new FeatureLayer({
                    url: self.props.src,
                    outFields: ["*"],
                });

                self.state.map.add(featureLayer);
            }

            if (self.props.type === "dynamic") {

                var maplayer = new MapImageLayer({
                    url: self.props.src
                });

                self.state.map.add(maplayer);
            }


            if (self.props.type === "image") {


                var imagelayer = new ImageryLayer({
                    url: self.props.src,
                    format: "jpgpng" // server exports in either jpg or png format
                });

                self.state.map.add(imagelayer);

            }

            //this.state.view.graphics.add(graphic);
        }); //.catch ((err) => console.error(err));
    }


    render() {
        return null;
    }


}

export default ArcticMapLayer;