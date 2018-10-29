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



            // this.setState({ graphic });

            if (self.props.type === "feature") {

                var featureLayer = new FeatureLayer({
                    url: self.props.src,
                    outFields: ["*"],
                });
                self.layerRef = featureLayer;
                self.state.map.add(featureLayer);
            }

            if (self.props.type === "dynamic") {

                var maplayer = new MapImageLayer({
                    url: self.props.src
                });
                maplayer.when(() => {
                    // console.log(maplayer);

                    var layerids = [];
                    maplayer.allSublayers.items.forEach(sublayer => {
                        layerids.push(sublayer.id);
                    });
                    layerids.reverse();

                    self.identifyTask = new IdentifyTask(self.props.src);
                    self.params = new IdentifyParameters();
                    self.params.tolerance = 3;
                    self.params.layerIds = layerids;
                    self.params.layerOption = "visible";
                    self.params.width = self.state.view.width;
                    self.params.height = self.state.view.height;
                    self.params.returnGeometry = true;

                    //  console.log(self.params);

                });

                self.layerRef = maplayer;
                self.state.map.add(maplayer);
            }


            if (self.props.type === "image") {


                var imagelayer = new ImageryLayer({
                    url: self.props.src,
                    format: "jpgpng" // server exports in either jpg or png format
                });
                self.layerRef = imagelayer;
                self.state.map.add(imagelayer);

            }

            //this.state.view.graphics.add(graphic);
        }); //.catch ((err) => console.error(err));
    }

    renderPopup(feature){
        if(!true){

        }
        else{
            console.log(feature);
            var popupText = "";
            var atts = Object.getOwnPropertyNames(feature.attributes);
            atts.forEach(att =>{
                popupText += `<b>${att}</b> : ${feature.attributes[att]}<br/>`
            });

        return popupText;
        }
    }

    render() {
        return null;
    }

    identify(event, callback) {
        console.log(this.layerRef);
        //console.log("Identify");
        this.params.geometry = event.mapPoint;
        this.params.mapExtent = this.state.view.extent;
        //document.getElementById("viewDiv").style.cursor = "wait";
        this.identifyTask.execute(this.params).then(function (response) {
            //console.log(response);
            callback(response);


        });

    }


}

export default ArcticMapLayer;