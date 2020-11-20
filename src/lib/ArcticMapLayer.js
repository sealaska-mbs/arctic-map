import React from "react";
import ReactDOM from 'react-dom'
import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';

import {
    loadModules
} from 'react-arcgis';

class ArcticMapLayer extends React.Component {
    static displayName = "ArcticMapLayer";
    constructor(props) {
        super(props);

        this.state = {
            map: props.map,
            view: props.view,
            graphic: null,
            title: props.title,
            blockSelect: props.blockIdentSelect !== undefined,
            disablePopup: props.disablePopup !== undefined
        };
    }

    componentWillUnmount() {
        this.props.view.graphics.remove(this.state.graphic);
    }

    componentDidMount() {
        var self = this;
        loadModules(['esri/Graphic',
            "esri/layers/FeatureLayer",
            "esri/layers/MapImageLayer",
            "esri/layers/ImageryLayer",

            "esri/layers/GraphicsLayer",
            "esri/tasks/IdentifyTask",
            "esri/tasks/support/IdentifyParameters",
            "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/layers/GroupLayer",
            "esri/renderers/Renderer"
        ]).then(([
            Graphic,
            FeatureLayer,
            MapImageLayer,
            ImageryLayer,

            GraphicsLayer,
            IdentifyTask,
            IdentifyParameters,
            Point,
            SimpleMarkerSymbol,
            GroupLayer,
            Renderer
        ]) => {
            // Create a polygon geometry


            var children = React.Children.map(this.props.children, function (child) {
                if (child.type.displayName === 'ArcticMapLayerPopup') {
                    return child;
                    // return React.cloneElement(child, {
                    //     // ref: 'editor'
                    //   })
                }
            })


            self.layerRenderers = children;




            var childrenEles = [];
            if (self.props.children) {
                if (Array.isArray(self.props.children)) {
                    childrenEles = self.props.children;
                }
                else {
                    childrenEles.push(self.props.children);
                }
            }

            var renderers = childrenEles.filter(child => {
                if (child.type.displayName === 'ArcticMapLayerRenderer') {
                    return child;
                }
            });




            // this.setState({ graphic });

            if (self.props.type === "feature") {
                var flayers = self.props.sublayers;
                if(!flayers || self.props.sublayers.length<1) {
                    flayers = [{id:0, title:""}];
                }

                var gmaplayer = new GroupLayer();

                var trans = 1;
                if (self.props.transparency) {
                    trans = Number.parseFloat(self.props.transparency);
                }

                flayers.forEach(function (sub) {
                    //portalItem
                    var glayer = new FeatureLayer({
                        title: sub.title,
                        outFields: ["*"],
                        opacity: gtrans
                    });    
                    if(sub.visible===false){
                        glayer.visible = false;
                    }

                    if(self.props.portalItem){
                        glayer.portalItem = {id: self.props.src};
                        glayer.layerId = sub.id;

                    }else{
                        glayer.url = self.props.src+sub.id;
                    }

                    var renderer = renderers.find(r => {
                        if (r.props.layer === sub.title || r.props.layer === `${sub.id}`) {
                            return r;
                        }
                    });
                    if (renderer !== undefined) {
                        glayer.renderer = renderer.props.style;
                    }

                    gmaplayer.layers.add(glayer);
                }); 
                
                var featureLayer;
                if(flayers.length>1)featureLayer = gmaplayer;
                else featureLayer = gmaplayer.layers[0];

                featureLayer.opacity = trans;

                if (self.props.title) {
                    featureLayer.title = self.props.title;
                }

                self.layerRef = featureLayer;
                self.state.map.add(featureLayer);
            }

            if (self.props.type === "group") {
                var gtrans = 1;
                if (self.props.transparency) {
                    gtrans = Number.parseFloat(self.props.transparency);
                }
                var srcsplit = self.props.src.split(',');
                
                var gmaplayer = new GroupLayer({
                    //url: self.props.src,
                    opacity: gtrans

                });
                if (self.props.title) {

                    gmaplayer.title = self.props.title;
                }

                var idx = 0;
                srcsplit.forEach(function (src) {
                    var glayer = new MapImageLayer({
                        url: src,
                        opacity: gtrans

                    });

                    if(self.props.sublayers && self.props.sublayers.length>idx){
                        glayer.sublayers = self.props.sublayers[idx];
                        idx++;
                    }

                    gmaplayer.layers.add(glayer);


                    glayer.when(() => {


                        var layerids = [];
                        
                        //console.log("Maplayer: ", maplayer);
                        glayer.allSublayers.items.forEach(sublayer => {
                            layerids.push(sublayer.id);
                            //console.log("Sublayer:", sublayer);

                            var renderer = renderers.find(r => {
                                if (r.props.layer === sublayer.title || r.props.layer === `${sublayer.id}`) {
                                    return r;
                                }
                            });
                            if (renderer !== undefined) {
                                //console.log("Sublayer renderer:", renderer.props.style);
                                sublayer.renderer = renderer.props.style;
                            }
                            //sublayer.renderer = Renderer.fromJSON(renderer);

                        });
                        layerids.reverse();

                        self.identifyTask = new IdentifyTask(src);
                        self.params = new IdentifyParameters();
                        self.params.tolerance = 3;
                        self.params.layerIds = layerids;
                        self.params.layerOption = "visible";
                        self.params.width = self.state.view.width;
                        self.params.height = self.state.view.height;
                        self.params.returnGeometry = true;
                        self.params.returnGeometry = !self.state.blockSelect;

                        //  console.log(self.params);

                    });

                });

                self.layerRef = gmaplayer;
                self.state.map.add(gmaplayer);
            }

            if (self.props.type === "dynamic") {

                var trans = 1;
                if (self.props.transparency) {
                    trans = Number.parseFloat(self.props.transparency);
                }







                var maplayer = new MapImageLayer({
                    url: self.props.src,
                    opacity: trans
                    //sublayers: []

                });
                
                if(self.props.sublayers) {
                    maplayer.sublayers = self.props.sublayers;
                }


                if (self.props.childsrc);

                if (self.props.title) {

                    maplayer.title = self.props.title;
                }

                maplayer.on("layerview-create", function (event) {
                    // console.lof("Layerview:" , event)
                });

                maplayer.when(() => {


                    var layerids = [];
                    //console.log("Maplayer: ", maplayer);
                    maplayer.allSublayers.items.forEach(sublayer => {
                        layerids.push(sublayer.id);
                        //console.log("Sublayer:", sublayer);

                        var renderer = renderers.find(r => {
                            if (r.props.layer === sublayer.title || r.props.layer === `${sublayer.id}`) {
                                return r;
                            }
                        });
                        if (renderer !== undefined) {
                            //console.log("Sublayer renderer:", renderer.props.style);
                            sublayer.renderer = renderer.props.style;
                        }
                        //sublayer.renderer = Renderer.fromJSON(renderer);

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
                    self.params.returnGeometry = !self.state.blockSelect;

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

            // if (self.props.type === "geojson") {

            //     var geojsonLayer = new GraphicsLayer({ title: 'GeoJSON Layer', listMode: "hide" });
            //     // var geojsonLayer = new GeoJSONLayer({
            //     //     //source: self.props.src,
            //     //     //copyright: "USGS Earthquakes",
            //     //     //popupTemplate: template
            //     //   });
            //     var dataarr = [];

            //     if (typeof self.props.src === 'object') {
            //         if (self.props.src.features) {
            //             dataarr = self.props.src.features;
            //         }
            //         else {
            //             dataarr = self.props.src;
            //         }
            //     }

            //     if (self.props.title) {

            //         geojsonLayer.title = self.props.title;
            //     }


            //     dataarr.forEach(obj => {
            //         //var esrijson = geojsonToArcGIS(obj);
            //         if (obj.geometry.type === "Point") {

            //             var popupTemplate = {
            //                 title: "{Name}",
            //                 content: self.props.template,
            //             };


            //             var point = new Point({
            //                 longitude: obj.geometry.coordinates[1],
            //                 latitude: obj.geometry.coordinates[0],

            //             });

            //             // Create a symbol for drawing the point
            //             var markerSymbol = new SimpleMarkerSymbol({
            //                 color: [226, 119, 40],
            //                 outline: {
            //                     color: [255, 255, 255],
            //                     width: 1
            //                 }
            //             });

            //             // Create a graphic and add the geometry and symbol to it
            //             var pointGraphic = new Graphic({
            //                 geometry: point,
            //                 symbol: markerSymbol,
            //                 attributes: obj.properties,
            //                 popupTemplate: popupTemplate,
            //                 // extent : new Extent().centerAt(point)
            //             });

            //             // Add the graphic to the view
            //             geojsonLayer.graphics.add(pointGraphic);
            //         }


            //     })


            //     self.layerRef = geojsonLayer;
            //     self.state.map.add(geojsonLayer);
            //     // var imagelayer = new ImageryLayer({
            //     //     url: self.props.src,
            //     //     format: "jpgpng" // server exports in either jpg or png format
            //     // });
            //     // self.layerRef = imagelayer;
            //     // self.state.map.add(imagelayer);

            // }


            self.layerRef.when(function () {
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

    zoomto() {
        if (this.layerRef.graphics) {
            this.state.view.goTo(this.layerRef.graphics.items);
        }

    }

    renderPopupTitle(feature, result){
        if(result.layerId !== undefined && this.layerRenderers) {
            var popupTitle = this.layerRenderers.find(l => l.props.layerid === result.layerId.toString());
            if (popupTitle  && result.layerId == popupTitle.props.layerid) {
                if(popupTitle.props.popuptitle) return popupTitle.props.popuptitle;
                else return result.layerName;
            } else {
                popupTitle = this.layerRenderers.find(l => l.props.layerid === null);
                if(popupTitle && popupTitle.props.popuptitle) return popupTitle.props.popuptitle;
                return result.layerName;
            }
        } else {
            return result.layerName;
        }
    }

    renderPopup(feature, result) {


        if (result.layerId !== undefined && this.layerRenderers) {
            var popuprender = this.layerRenderers.find(l => l.props.layerid === result.layerId.toString());
            if (!popuprender) popuprender = this.layerRenderers.find(l => l.props.layerid === null);
            if (popuprender && popuprender.props.popup !== undefined) {
                var ele = popuprender.props.popup(feature, result);




                if (ele) {
                    var workingdiv = document.createElement('div');
                    ReactDOM.render(ele, workingdiv);
                    return workingdiv;
                }
            }
        }




        var popupText = "";
        var atts = Object.getOwnPropertyNames(feature.attributes);
        atts.forEach(att => {
            if (att === 'layerName') {

            }
            else {
                popupText += `<b>${att}</b> : ${feature.attributes[att]}<br/>`;
            }
        });

        return popupText;

    }

    render() {
        return null;
    }

    identify(event, callback) {

        var self = this;
        if (this.props.type === "geojson") {

            this.state.view.hitTest(event).then((htresponse) => {

                // console.log("Identify on geojson");
                //console.log(htresponse);
                var mapPoint = event.mapPoint;
                var response = {
                    layer: self.layerRef,
                    results: htresponse.results.map(r => { return { feature: r.graphic, layerName: self.layerRef.title }; }),
                }
                callback(response)
            });

        }
        else {


            if (!this.params) { callback(null); return; }

            this.params.geometry = event.mapPoint;
            this.params.mapExtent = this.state.view.extent;
            //this.params.returnGeometry = true;
            //document.getElementById("viewDiv").style.cursor = "wait";
            this.identifyTask.execute(this.params).then(function (response) {

                callback(response);


            });
        }
    }

    identifyArea(eventS, eventE, sublayers, callback) {

        var points = new Multipoint();
        points.addPoint(eventS.mapPoint);
        points.addPoint(eventE.mapPoint);

        if (!this.params) { callback(null); return; }

        this.params.layerIds = sublayers;
        this.params.geometry = points.extent;
        this.params.mapExtent = this.state.view.extent;
        this.identifyTask.execute(this.params).then(function (response) {
            this.params.layerIds = null;
            callback(response);
        });
    }


}

export default ArcticMapLayer;