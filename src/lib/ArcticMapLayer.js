import React, { Component } from "react";
import ReactDOM from 'react-dom'
import geojsonToArcGIS from '@esri/arcgis-to-geojson-utils';

//import { loadModules } from 'react-arcgis';
import Graphic from '@arcgis/core/Graphic.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer.js';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import * as identify from '@arcgis/core/rest/identify.js';
import IdentifyParameters from '@arcgis/core/rest/support/IdentifyParameters.js';
import Point from '@arcgis/core/geometry/Point.js';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import GroupLayer from '@arcgis/core/layers/GroupLayer.js';
import Renderer from '@arcgis/core/renderers/Renderer.js'
import Multipoint from '@arcgis/core/geometry/Multipoint.js';

class ArcticMapLayer extends React.Component {
    static displayName = "ArcticMapLayer";
    constructor(props) {
        super(props);
//        console.log(props)

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
//        console.log("ComponentDidMount: "+this.props.title);
//        loadModules(['esri/Graphic',
//            "esri/layers/FeatureLayer",
//            "esri/layers/MapImageLayer",
//            "esri/layers/ImageryLayer",
//
//            "esri/layers/GraphicsLayer",
//            "esri/tasks/IdentifyTask",
//            "esri/tasks/support/IdentifyParameters",
//            //"esri/rest/support/IdentifyParameters",
//            "esri/geometry/Point",
//            "esri/symbols/SimpleMarkerSymbol",
//            "esri/layers/GroupLayer",
//            "esri/renderers/Renderer"
//        ]).then(([
//            Graphic,
//            FeatureLayer,
//            MapImageLayer,
//            ImageryLayer,
//
//            GraphicsLayer,
//            IdentifyTask,
//            IdentifyParameters,
//            Point,
//            SimpleMarkerSymbol,
//            GroupLayer,
//            Renderer
//        ]) => {
            // Create a polygon geometry

            var children2 = [];
            var children = React.Children.map(this.props.children, function (child) {
                   if (child.type.displayName === 'ArcticMapLayerPopup') {
                       return child;
                       // return React.cloneElement(child, {
                       //     // ref: 'editor'
                       //   })
                   }
                   else if (child.type.displayName === 'ArcticMapLayer') {
                        var subchildren = [];
                        //console.log(child.props.children);
                        child.props.children.forEach(function (subchild) {
                           if (subchild.type.displayName === 'ArcticMapLayerPopup') {
                              //console.log(subchild);
                              subchildren.push(subchild);
                           }
                       })
                       children2 = subchildren;  
                   }
               })
               if (children2.length > 0 ){
                   self.layerRenderers = children2;
               }
               else {
                   self.layerRenderers = children;
               }
               //console.log(self.layerRenderers);
   
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
                
                var featureLayer = gmaplayer;
                featureLayer.opacity = trans;

                if (self.props.title) {
                    featureLayer.title = self.props.title;
                }

                self.layerRef = featureLayer;
                //self.state.map.add(featureLayer);
            }

            if(self.props.type === "groupby") {
                var gtrans = 1;
                if (self.props.transparency) {
                    gtrans = Number.parseFloat(self.props.transparency);
                }
                var subChildren = React.Children.map(self.props.children, function (child) {
                    return new ArcticMapLayer(child.props)
                });

                self.children = subChildren;
                
                var gbmaplayer = new GroupLayer({
                    opacity: gtrans,
                    visibilityMode: "inherited",
                    visible: self.props.visible

                });
                if (self.props.title) {
                    gbmaplayer.title = self.props.title;
                }

                subChildren.forEach(function (child) {
                    if (child.props.type === "dynamic") {

                        var trans = 1;
                        if (child.props.transparency) {
                            trans = Number.parseFloat(child.props.transparency);
                        }
        
                        var maplayer = new MapImageLayer({
                            url: child.props.src,
                            opacity: trans
                        });
                        
                        if(child.props.sublayers) {
                            maplayer.sublayers = child.props.sublayers;
                        }
        
                        if (child.props.childsrc);
        
                        if (child.props.title) {
        
                            maplayer.title = child.props.title;
                        }
        
                        maplayer.on("layerview-create", function (event) {
                        });
        
                        maplayer.when(() => {
                            var layerids = [];
                            maplayer.allSublayers.items.forEach(sublayer => {
                                layerids.push(sublayer.id);
                                sublayer.when(function(e){
                                    if(child.props.sublayers !== undefined){
                                        child.props.sublayers.forEach(sub => {
                                            if(sub.isVisible === false && (e.id === sub.id)){
                                                e.visible = false;
                                            }
                                        });
                                    }
                                });
                                var renderer = renderers.find(r => {
                                    if (r.props.layer === sublayer.title || r.props.layer === `${sublayer.id}`) {
                                        return r;
                                    }
                                });
                                if (renderer !== undefined) {
                                    sublayer.renderer = renderer.props.style;
                                    if (renderer.props.displayTitle !== undefined) {
                                        sublayer.title = renderer.props.displayTitle;
                                    }
                                }
                            });
        
                            child.identifyTask = new IdentifyTask(child.props.src);
                            child.params = new IdentifyParameters();
                            child.params.tolerance = 3;
                            child.params.layerIds = layerids;
                            child.params.layerOption = "visible";
                            child.params.width = self.state.view.width;
                            child.params.height = self.state.view.height;
                            child.params.returnGeometry = true;
                            child.params.returnGeometry = !self.state.blockSelect;
                        });
        
                        child.layerRef = maplayer;
                    }
        
                    gbmaplayer.layers.push(maplayer);
                });

                self.layerRef = gbmaplayer;
            }
            
            if (self.props.type === "group") {
                var gtrans = 1;
                if (self.props.transparency) {
                    gtrans = Number.parseFloat(self.props.transparency);
                }
                var srcsplit = self.props.src.split(',');
                
                var gmaplayer = new GroupLayer({
                    //url: self.props.src,
                    opacity: gtrans,
                    visibilityMode: "inherited"

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
                            var renderer = renderers.find(r => {
                                if (r.props.layer === sublayer.title || r.props.layer === `${sublayer.id}`) {
                                    return r;
                                }
                            });
                            if (renderer !== undefined) {
                                sublayer.renderer = renderer.props.style;
                            }
                            //sublayer.renderer = Renderer.fromJSON(renderer);

                        });
                        layerids.reverse();
                        if(src===srcsplit[srcsplit.length-1]){
                            self.identifyTask = new IdentifyTask(src);
                            self.params = new IdentifyParameters();
                            self.params.tolerance = 3;
                            self.params.layerIds = layerids;
                            self.params.layerOption = "visible";
                            self.params.width = self.state.view.width;
                            self.params.height = self.state.view.height;
                            self.params.returnGeometry = true;
                            self.params.returnGeometry = !self.state.blockSelect;
                              //console.log(self.params);
                        }
                    });

                });

                self.layerRef = gmaplayer;
                //self.state.map.add(gmaplayer);
            }

            if (self.props.type === "dynamic") {

                var trans = 1;
                if (self.props.transparency) {
                    trans = Number.parseFloat(self.props.transparency);
                }

                var maplayer = new MapImageLayer({
                    url: self.props.src,
                    opacity: trans
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
                    maplayer.allSublayers.items.forEach(sublayer => {
                        layerids.push(sublayer.id);
                        sublayer.when(function(e){
                            if(self.props.sublayers !== undefined){
                                self.props.sublayers.forEach(sub => {
                                    if(sub.isVisible === false && (e.id === sub.id)){
                                        e.visible = false;
                                    }
                                });
                            }
                        });
                        var renderer = renderers.find(r => {
                            if (r.props.layer === sublayer.title || r.props.layer === `${sublayer.id}`) {
                                return r;
                            }
                        });
                        if (renderer !== undefined) {
                            sublayer.renderer = renderer.props.style;
                            if (renderer.props.displayTitle !== undefined) {
                                sublayer.title = renderer.props.displayTitle;
                            }
                        }
                        //sublayer.renderer = Renderer.fromJSON(renderer);
                    });
                    //layerids.reverse();

                    self.identifyTask = new IdentifyTask(self.props.src);
                    self.params = new IdentifyParameters();
                    self.params.tolerance = 3;
                    self.params.layerIds = layerids;
                    self.params.layerOption = "visible";
                    self.params.width = self.state.view.width;
                    self.params.height = self.state.view.height;
                    self.params.returnGeometry = true;
                    self.params.returnGeometry = !self.state.blockSelect;
                });

                self.layerRef = maplayer;
                //self.state.map.add(maplayer);
            }

            if (self.props.type === "image") {
                var imagelayer = new ImageryLayer({
                    url: self.props.src,
                    format: "jpgpng" // server exports in either jpg or png format
                });
                self.layerRef = imagelayer;
                //self.state.map.add(imagelayer);
            }

            if (self.props.type === "custom") {
                self.layerRef = self.props.layerRef;
                //self.state.map.add(self.props.layerRef);
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
            if(self.props.visible !== undefined && self.props.visible === "false"){
                self.layerRef.visible = false;

            }

            self.state.map.add(self.layerRef);
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
//        }); //.catch ((err) => console.error(err));
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
        console.log("renderPopup",result);

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
        if(feature.attributes){
            var atts = Object.getOwnPropertyNames(feature.attributes);
            atts.forEach(att => {
                if (att === 'layerName') {
    
                }
                else {
                    popupText += `<b>${att}</b> : ${feature.attributes[att]}<br/>`;
                }
            });
        }

        return popupText;

    }

    render() {
        return null;
    }

    identify(event, callback) {
        
        var self = this;
        //console.log("identify", self)
        
        if (this.props.type === "geojson") {

            this.state.view.hitTest(event).then((htresponse) => {

                // console.log("Identify on geojson");
                //console.log(htresponse);
                var mapPoint = event.mapPoint;
                var response = {
                    layer: self,
                    results: htresponse.results.map(r => { return { feature: r.graphic, layerName: self.layerRef.title }; }),
                }
                callback([response])
            });

        }
        else if (this.props.type === "feature") {
            //this probably has errors but we are not using it 
            this.state.view.hitTest(event).then((htresponse) => {

                // console.log("Identify on geojson");
                //console.log(htresponse);
                var mapPoint = event.mapPoint;
                var layersLeft = self.layerRef.layers.length;
                var responses = [];
                self.layerRef.layers.map((layer) => {
                    layer.queryFeatures({
                        //query object
                        geometry: mapPoint,
                        spatialRelationship: "intersects",
                        returnGeometry: !self.state.blockSelect,
                        outFields: ["*"],
                      })
                      .then((response) => {
                        responses = responses.concat(response.features);
                        layersLeft--;

                        if(layersLeft<1){
                            var res = responses.map(feat => {
                                return {
                                    feature:feat,
                                    layerName:feat.layer.title,
                                    layerId:feat.layer.layerId
                                };

                            });

                            callback({results:res});
                        } 
                      });
                }); 
            });
        }
        else if (this.props.type === "groupby") {
            var allResponse = [];
            Promise.allSettled(self.children.map(function (item,index) {
                return new Promise((res, rej) => {
                    item.params.geometry = event.mapPoint;
                    item.params.mapExtent = self.state.view.extent;
                    item.identifyTask.execute(item.params).then(function (response) {
                        response.layer=item;
                        response.layer.layerRenderers = item.props.children;
                        allResponse.push(response);
                        res();
                    });
                    
                });
            })).then(() => {callback(allResponse);});
        }   
        else {
            if (!this.params) { callback(null); return; }

            this.params.geometry = event.mapPoint;
            this.params.mapExtent = this.state.view.extent;
            this.identifyTask.execute(this.params).then(function (response) {
                response.layer = self;
                callback([response]);
            });
        }
    }

    identifyArea(eventPS, eventPE, sublayers, callback) {
        var self = this;
//        loadModules(["esri/geometry/Multipoint"]).then(([Multipoint]) => {
            var points = new Multipoint();
            points.addPoint(eventPS);
            points.addPoint(eventPE);
    
            if (!self.params) { callback(null); return; }

            var layerids = self.params.layerIds;
    
            self.params.layerIds = sublayers;
            self.params.geometry = points.extent;
            self.params.geometry.spatialReference = self.state.view.extent.spatialReference;
            self.params.mapExtent = self.state.view.extent;
            self.identifyTask.execute(self.params).then(function (response) {
                self.params.layerIds = layerids;
                //console.log("identifyArea", response)
                callback(response);
            });
//        });
    }


}

export default ArcticMapLayer;
