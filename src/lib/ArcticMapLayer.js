import React from "react";
import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';

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
            "esri/layers/GeoJSONLayer",
            "esri/layers/GraphicsLayer",
            "esri/tasks/IdentifyTask",
            "esri/tasks/support/IdentifyParameters",
            "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/geometry/Extent"
        ]).then(([
            Graphic,
            FeatureLayer,
            MapImageLayer,
            ImageryLayer,
            GeoJSONLayer,
            GraphicsLayer,
            IdentifyTask,
            IdentifyParameters,
            Point,
            SimpleMarkerSymbol,
            Extent
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

            if (self.props.type === "geojson") {

                var geojsonLayer = new GraphicsLayer({ title: 'GeoJSON Layer', listMode: "hide" });
                // var geojsonLayer = new GeoJSONLayer({
                //     //source: self.props.src,
                //     //copyright: "USGS Earthquakes",
                //     //popupTemplate: template
                //   });
                var dataarr = [];

                if (typeof self.props.src == 'object') {
                    if (self.props.src.features) {
                        dataarr = self.props.src.features;
                    }
                    else {
                        dataarr = self.props.src;
                    }
                }


                dataarr.forEach(obj => {
                    var esrijson = geojsonToArcGIS(obj);
                    if (obj.geometry.type == "Point") {

                        var popupTemplate = {
                            title: "{Name}",
                            content: self.props.template,
                          };


                        var point = new Point({
                            longitude: obj.geometry.coordinates[1],
                            latitude: obj.geometry.coordinates[0],
                            
                          });
                        
                          // Create a symbol for drawing the point
                          var markerSymbol = new SimpleMarkerSymbol({
                            color: [226, 119, 40],
                            outline: {
                              color: [255, 255, 255],
                              width: 1
                            }
                          });
                        
                          // Create a graphic and add the geometry and symbol to it
                          var pointGraphic = new Graphic({
                            geometry: point,
                            symbol: markerSymbol,
                            attributes : obj.properties,
                            popupTemplate: popupTemplate,
                            extent : Extent.centerAt(point)
                          });
                        
                          // Add the graphic to the view
                          geojsonLayer.graphics.add(pointGraphic);
                    }


                })


                self.layerRef = geojsonLayer;
                self.state.map.add(geojsonLayer);
                // var imagelayer = new ImageryLayer({
                //     url: self.props.src,
                //     format: "jpgpng" // server exports in either jpg or png format
                // });
                // self.layerRef = imagelayer;
                // self.state.map.add(imagelayer);

            }


            self.layerRef.when(function(){
            setTimeout(() => {
                var evt = new Event('ready', { bubbles: true });
                Object.defineProperty(evt, 'target', { value: self, enumerable: true });
        
                if (self.props.onready) {
                  self.props.onready(evt);
                }
              }, 500)
            });

            //this.state.view.graphics.add(graphic);
        }); //.catch ((err) => console.error(err));
    }

    zoomto(){
        if(this.layerRef.graphics){
        this.state.view.goTo(this.layerRef.graphics);
        }
       
    }

    renderPopup(feature) {
        if (!true) {

        }
        else {
            console.log(feature);
            var popupText = "";
            var atts = Object.getOwnPropertyNames(feature.attributes);
            atts.forEach(att => {
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
        if (!this.params) { callback(null); return; }
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