import React from "react";
import ReactDOM from "react-dom";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import ArcticMapButton from './ArcticMapButton';
import ArcticMapPanel from './ArcticMapPanel';
import ArcticMapLayer from './ArcticMapLayer';
import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';
import style from  './ArcticMapEdit.css';

import {
    loadModules
} from 'react-arcgis';


class ArcticMapEdit extends React.Component {
    static displayName = 'ArcticMapEdit';
    constructor(props) {
        super(props);

        props.map.editor = this;
        this.state = {
            map: props.map,
            view: props.view,
            graphic: null,
            hideEditors: false,
            editing: false,
            showUploading: false,
            hidden: !this.props.hidden ? false : true,            
        };

        this.uploadPanel = React.createRef();
    }



    componentWillUnmount() {
        this.props.view.graphics.remove(this.state.graphic);
    }

    componentDidMount() {



        var self = this;
        loadModules(["esri/Graphic",
            "esri/layers/GraphicsLayer",
            "esri/widgets/Sketch/SketchViewModel",
            "esri/geometry/Geometry",
            "esri/geometry/Polygon",
            "esri/geometry/geometryEngine"
        ]).then(([
            Graphic,
            GraphicsLayer,
            SketchViewModel,
            Geometry,
            Polygon,
            geometryEngine
        ]) => {
            const tempGraphicsLayer = new GraphicsLayer({ title: 'Edit Layer', listMode: "hide" });
            self.setState({ tempGraphicsLayer });

            self.state.map.add(tempGraphicsLayer);


            const sketchViewModel = new SketchViewModel({
                view: self.state.view,
                layer: tempGraphicsLayer,
                defaultUpdateOptions :{
                   // toggleToolOnClick : false
                },
                pointSymbol: {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    style: "circle",
                    color: "yellow",
                    size: "3px",
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 255],
                        width: 3
                    }
                },
                polylineSymbol: {
                    type: "simple-line", // autocasts as new SimpleLineSymbol()
                    color: "yellow",
                    width: "3",
                    style: "solid"
                },
                polygonSymbol: {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: "rgba(224, 206, 69, 0.8)",
                    style: "solid",
                    outline: {
                        color: "yellow",
                        width: 3
                    }
                }
            });

            if (this.props.updateongraphicclick !== undefined) {
                sketchViewModel.updateOnGraphicClick = this.props.updateongraphicclick;
            }

            self.setState({ tempGraphicsLayer, sketchViewModel });

            self.setUpClickHandler.bind(this);

            sketchViewModel.on("create", (event) => {

                if (event.state === 'complete') {

                    tempGraphicsLayer.graphics = [event.graphic];
                    if (this.props.single) {

                        this.setState({ hideEditors: true });
                    }



                    setTimeout(() => {

                        self.setState({ geojson: arcgisToGeoJSON(event.graphic.geometry.toJSON()), datajson: event.graphic.toJSON(), editing: false });
                        self.firenewfeature();
                    }, 1000);


                }
            });


            sketchViewModel.on("update", (event) => {
                self.setState({ editing: true });
                if(event.state === 'start' && self.state.mode === 'select'){
                    return false;
                }
                if (event.state === 'complete' || event.state === 'cancel') {
                    // const graphic = new Graphic({
                    //     geometry: event.graphic.geometry,
                    //     symbol: event.graphic.symbol
                    // });
                    //tempGraphicsLayer.add(event.graphic);
                    // if (this.props.single) {
                    //     console.log("Added one feature");
                    //     this.setState({ hideEditors: true });
                    // }

                    setTimeout(() => {
                        self.setState({ geojson: arcgisToGeoJSON(event.graphics[0].geometry.toJSON()), datajson: event.graphics[0].toJSON(), });
                        //this.geojson = event.geometry;
                        self.firenewfeature();
                    }, 1000);

                }
            });

            // Listen the sketchViewModel's update-complete and update-cancel events
            sketchViewModel.on("update-complete", (event) => {
                event.graphic.geometry = event.geometry;
                tempGraphicsLayer.graphics = [event.graphic];
                //tempGraphicsLayer.add(event.graphic);

                // set the editGraphic to null update is complete or cancelled.
                self.state.editGraphic = null;



            });



            this.top_right_node = document.createElement("div");
            self.state.view.ui.add(this.top_right_node, "top-right");

            self.setState({ loaded: true })

            //self.setUpClickHandler();


            // scoped methods
            self.setEditFeature = (feature, nofire, type, zoomto, addto, trim) => {
                
                if (nofire === null) {
                    nofire = false;
                }

                if (type === null) {
                    type = "polygon";
                }

                if (zoomto === null) {
                    zoomto = true;
                }

                if (addto === null) {
                    addto = false;
                }
                if (trim === null) {
                    trim = false;
                }

                if (feature.attributes.layerName) {
                    feature.sourceLayer = feature.attributes.layerName.trim();
                } else {
                    feature.sourceLayer = 'PLSS';
                }

                if (!feature.geometry.type) {
                    if (type === "polygon") {
                        
                        feature.geometry = new Polygon(feature.geometry);
                        feature.geometry.type = "polygon";
                    }
                }

                this.state.sketchViewModel.cancel();
                if (!addto) {
                    this.state.tempGraphicsLayer.removeAll();
                }
                this.setState({ hideEditors: false, geojson: null });


                var graphic = null;
                if (!feature.geometry.toJSON && feature.symbol) {
                    graphic = Graphic.fromJSON(feature);

                }
                else {



                    graphic = new Graphic({
                        geometry: feature.geometry,
                        symbol: this.state.sketchViewModel.polygonSymbol
                    });
                    

                }

                if (graphic.geometry === null) {
                    graphic.geometry = feature.geometry;
                    
                }


                if (trim) {
                    if (this.state.tempGraphicsLayer.graphics.items.length > 0) {

                        var geometrys = this.state.tempGraphicsLayer.graphics.items.map(i => i.geometry);
                        
                        var merge = geometryEngine.union(geometrys);
                        var isEqual = geometryEngine.equals(merge, graphic.geometry);
                        if(!isEqual) {
                            merge = geometryEngine.difference(merge, graphic.geometry);
                            graphic = new Graphic({
                                geometry: merge,
                                symbol: this.state.sketchViewModel.polygonSymbol
                            });
                            graphic.geometry.sourceLayer = feature.sourceLayer;
                            this.state.tempGraphicsLayer.graphics = [graphic];
                        } else {
                            this.state.tempGraphicsLayer.graphics = null;
                        }
                        

                    }
                }
                else {
                    this.state.tempGraphicsLayer.add(graphic);

                    if (this.state.tempGraphicsLayer.graphics.items.length > 0) {

                        var geometrys = this.state.tempGraphicsLayer.graphics.items.map(i => i.geometry);


                        var merge = geometryEngine.union(geometrys);

                        graphic = new Graphic({
                            geometry: merge,
                            symbol: this.state.sketchViewModel.polygonSymbol
                        })
                        graphic.geometry.sourceLayer = feature.sourceLayer;
                        this.state.tempGraphicsLayer.graphics = [graphic]
                    }
                }
                //this.state.tempGraphicsLayer.graphics = [graphic];
                if (this.props.single) {

                    this.setState({ hideEditors: true });
                }

                if (zoomto) {

                    self.state.view.goTo(graphic);
                }


                var geometry = feature.geometry;
                if (geometry && !geometry.toJSON) {
                    geometry = Geometry.fromJSON(geometry);
                }

                this.setState({ geojson: arcgisToGeoJSON(geometry.toJSON()), datajson: graphic.toJSON(), });

                if (nofire === true) {

                }
                else {
                    self.firenewfeature();
                }

            };


            self.setEditFeature = self.setEditFeature.bind(self);



            self.setGeoJson = (geojson) => {
                //var esrijson = geojsonToArcGIS(geojson);


            }
            self.setGeoJson = self.setGeoJson.bind(self);


        }); //.catch ((err) => console.error(err));


    }


    firenewfeature() {
        var self = this;
        var evt = new Event('newfeature', { bubbles: true });
        Object.defineProperty(evt, 'target', { value: this, enumerable: true });
        evt.data = self.state.datajson;

        if (self.props.onnewfeature) {
            self.props.onnewfeature(evt);
        }

        setTimeout(() => {
            self.setState({ editing: false });
        }, 200);
    }

    addPointClick() {
        this.state.sketchViewModel.create("point", { mode: "click" });
        this.setState({ editing: true });
    }

    addLineClick() {
        this.state.sketchViewModel.create("polyline", { mode: "click" });
        this.setState({ editing: true });
    }
    addPolyClick() {
        this.state.sketchViewModel.create("polygon", { mode: "click" });
        this.setState({ editing: true });
    }
    addRecClick() {
        this.state.sketchViewModel.create("rectangle", { mode: "click" });
        this.setState({ editing: true });
    }
    addCircleClick() {
        this.state.sketchViewModel.create("circle", { mode: "click" });
        this.setState({ editing: true });
    }



    fileUploaded(evt) {
        var self = this;
        var fileName = evt.target.value.toLowerCase();
        if (fileName.indexOf(".zip") !== -1) {
            // console.log("addEventListener", self);
            self.processShapeFile(fileName, evt.target);
        }
        else if (fileName.indexOf(".kml") !== -1) {
            // console.log("addEventListener", self);
            self.processKMLFile(fileName, evt.target);
        }
        else if (fileName.indexOf(".geojson") !== -1) {
            // console.log("addEventListener", self);

            self.processGeojsonFile(fileName, evt.target);
        }
        else if (fileName.indexOf(".gml") !== -1) {
            // console.log("addEventListener", self);

            self.processGMLFile(fileName, evt.target);
        }
        else if (fileName.indexOf(".gpx") !== -1) {
            // console.log("addEventListener", self);

            self.processGPXFile(fileName, evt.target);
        }
        else {
            document.getElementById("upload-status").innerHTML =
                '<p style="color:red">Only shapefile(.zip), .gml, .gpx, .kml, or .geojson are supported</p>'
        }


    }


    readTextFile(file) {
        return new Promise((res, rej) => {
            var fr = new FileReader();
            fr.onload = (evt) => {
                res(evt.target.result);
            }
            fr.readAsText(file);
        });
    }

    kmlColor(v) {
        var color, opacity;
        v = v || '';
        if (v.substr(0, 1) === '#') { v = v.substr(1); }
        if (v.length === 6 || v.length === 3) { color = v; }
        if (v.length === 8) {
            opacity = parseInt(v.substr(0, 2), 16) / 255;
            color = '#' + v.substr(6, 2) +
                v.substr(4, 2) +
                v.substr(2, 2);
        }
        return [color, isNaN(opacity) ? undefined : opacity];
    }

    processGPXFile(fileName, form) {
        var file = fileName.replace(/^.*[\\\/]/, '');
        var self = this;
        this.readTextFile(form.files[0]).then(text =>{
            var parser = new DOMParser();
            var gj = self.fc();
            var xmlDoc = parser.parseFromString(text, "text/xml");
            var trkMember = self.get(xmlDoc,"trk");
            for (var j = 0; j < trkMember.length; j++) {
                gj.features = gj.features.concat(self.getTRKMember(trkMember[j]));
            }
            var features = [];
            gj.features.forEach(f=> {
                var esrijson = geojsonToArcGIS(f);
                features.push(esrijson);
            });
            self.addGeojsonToMap(features, file, "GPX");
            self.uploadPanel.current.toggle();
        });
    }
    getTRKMember(root) {
        var geometryProperty = this.get(root, "trkseg");
        var geomsCoord = this.getGeometry(geometryProperty[0]);
        var feature = {
            type: 'Feature',
            geometry: (geomsCoord.geoms.length === 1) ? geomsCoord.geoms[0] : {
                type: 'GeometryCollection',
                geometries: geomsCoord.geoms
            },
            //properties: properties
        };
        if (this.attr(root, 'id')) feature.id = this.attr(root, 'id');
        return [feature];
    }

    processGMLFile(fileName, form) {
        var file = fileName.replace(/^.*[\\\/]/, '');
        var self = this;
        this.readTextFile(form.files[0]).then(text =>{
            var parser = new DOMParser();
            var gj = self.fc();
            var xmlDoc = parser.parseFromString(text, "text/xml");
            var Polygon = self.get(xmlDoc,"gml:Polygon");
            var featureMember = self.get(xmlDoc,"gml:featureMember");
            for (var j = 0; j < featureMember.length; j++) {
                gj.features = gj.features.concat(self.getFeatureMember(featureMember[j]));
            }
            var features = [];
            
            gj.features.forEach(f=> {
                var esrijson = geojsonToArcGIS(f);
                features.push(esrijson);
            });
            self.addGeojsonToMap(features, file, "GML");
            self.uploadPanel.current.toggle();
        });
        
    }

    getFeatureMember(root) {
        var geometryProperty = this.get(root, "ogr:geometryProperty");
        var geomsCoord = this.getGeometry(geometryProperty[0]);
        var feature = {
            type: 'Feature',
            geometry: (geomsCoord.geoms.length === 1) ? geomsCoord.geoms[0] : {
                type: 'GeometryCollection',
                geometries: geomsCoord.geoms
            },
            //properties: properties
        };
        if (this.attr(root, 'id')) feature.id = this.attr(root, 'id');
        return [feature];
    }

    getGeometry(root) {
        
        var geotypes = [ 'LineString','Polygon', 'Point', 'Track', 'gx:Track', 'gml:Polygon', 'trkpt'];
        var geomNode, geomNodes, i, j, k, geoms = [], coordTimes = [];
        if (this.get1(root, 'MultiGeometry')) { return this.getGeometry(this.get1(root, 'MultiGeometry')); }
        if (this.get1(root, 'MultiTrack')) { return this.getGeometry(this.get1(root, 'MultiTrack')); }
        if (this.get1(root, 'gx:MultiTrack')) { return this.getGeometry(this.get1(root, 'gx:MultiTrack')); }
        if (this.get1(root, 'trkpt')) {
            geomNodes = this.get(root, 'trkpt');
            coords = [];
                for (k = 0;  k < geomNodes.length; k ++) {
                    coords.push([parseFloat(geomNodes[k].attributes[1].nodeValue), parseFloat(geomNodes[k].attributes[0].nodeValue)]);                   
                }
                geoms.push({
                    type: 'Polygon',
                    coordinates: [coords]
                });
        }
        for (i = 0; i < geotypes.length; i++) {
            geomNodes = this.get(root, geotypes[i]);
            if (geomNodes) {
                for (j = 0; j < geomNodes.length; j++) {
                    geomNode = geomNodes[j];
                    if (geotypes[i] === 'Point') {
                        geoms.push({
                            type: 'Point',
                            coordinates: this.coord1(this.nodeVal(this.get1(geomNode, 'coordinates')))
                        });
                    } else if (geotypes[i] === 'LineString') {
                        geoms.push({
                            type: 'LineString',
                            coordinates: this.coord(this.nodeVal(this.get1(geomNode, 'coordinates')))
                        });
                    } else if (geotypes[i] === 'Polygon') {
                        var rings = this.get(geomNode, 'LinearRing'),
                            coords = [];
                        for (k = 0; k < rings.length; k++) {
                            
                            coords.push(this.coord(this.nodeVal(this.get1(rings[k], 'coordinates'))));
                        }
                        geoms.push({
                            type: 'Polygon',
                            coordinates: coords
                        });
                    } else if (geotypes[i] === 'gml:Polygon') {
                        var rings = this.get(geomNode, 'gml:LinearRing'),
                            coords = [];
                        for (k = 0; k < rings.length; k++) {
                            
                            coords.push(this.coord(this.nodeVal(this.get1(rings[k], 'gml:coordinates'))));
                        }
                        geoms.push({
                            type: 'Polygon',
                            coordinates: coords
                        });
                    }  else if (geotypes[i] === 'Track' ||
                        geotypes[i] === 'gx:Track') {
                        var track = this.gxCoords(geomNode);
                        geoms.push({
                            type: 'LineString',
                            coordinates: track.coords
                        });
                        if (track.times.length) coordTimes.push(track.times);
                    }
                }
            }
        }
            
            return {
                geoms: geoms,
                coordTimes: coordTimes
            };
        
    }

    nodeVal(x) {
        if (x) { this.norm(x); }
        return (x && x.textContent) || '';
    }

    fc() {
        return {
            type: 'FeatureCollection',
            features: []
        }
    }
    xml2str(str) {
        var serializer;
        if (typeof XMLSerializer !== 'undefined') {
            /* istanbul ignore next */
            serializer = new XMLSerializer();
        } 
        if (str.xml !== undefined) return str.xml;
        return serializer.serializeToString(str);
    }

    okhash(x) {
        if (!x || !x.length) return 0;
        for (var i = 0, h = 0; i < x.length; i++) {
            h = ((h << 5) - h) + x.charCodeAt(i) | 0;
        } return h;
    }


    get(x, y) {return x.getElementsByTagName(y); }
    attr(x, y) { return x.getAttribute(y); }
    attrf(x, y) { return parseFloat(this.attr(x, y)); }
    get1(x, y) { 
        var n = this.get(x, y); 
        return n.length ? n[0] : null; }
    norm(el) { if (el.normalize) { el.normalize(); } return el; }
    coord1(v) { 
        var removeSpace = /\s*/g;
        return this.numarray(v.replace(removeSpace, '').split(',')); 
    }
    coord(v) {
        var trimSpace = /^\s*|\s*$/g;
        var splitSpace = /\s+/;
        var coords = v.replace(trimSpace, '').split(splitSpace),o = [];
        
        for (var i = 0; i < coords.length; i++) {
            o.push(this.coord1(coords[i]));
        }
        
        return o;
    }
    gxCoord(v) { return this.numarray(v.split(' ')); }
    numarray(x) {
        
        for (var j = 0, o = []; j < x.length; j++) { o[j] = parseFloat(x[j]); }
        return o;
    }
    gxCoords(root) {
        var elems = this.get(root, 'coord', 'gx'), coords = [], times = [];
        if (elems.length === 0) elems = this.get(root, 'gx:coord');
        for (var i = 0; i < elems.length; i++) coords.push(this.gxCoord(this.nodeVal(elems[i])));
        var timeElems = this.get(root, 'when');
        for (var j = 0; j < timeElems.length; j++) times.push(this.nodeVal(timeElems[j]));
        return {
            coords: coords,
            times: times
        };
    }

    processKMLFile(fileName, form) {
        var file = fileName.replace(/^.*[\\\/]/, '')
        var self = this;



        this.readTextFile(form.files[0]).then(text => {
            var parser = new DOMParser();
            var gj = self.fc()
            var xmlDoc = parser.parseFromString(text, "text/xml");
            var placemarks = self.get(xmlDoc, "Placemark");
            var styles = self.get(xmlDoc, "Style");
            var styleMaps = self.get(xmlDoc, "StyleMap");
            var styleIndex = {};
            var styleByHash = {};
            var styleMapIndex = {};
            for (var k = 0; k < styles.length; k++) {
                var hash = self.okhash(self.xml2str(styles[k])).toString(16);
                styleIndex['#' + self.attr(styles[k], 'id')] = hash;
                styleByHash[hash] = styles[k];
            }
            for (var l = 0; l < styleMaps.length; l++) {
                styleIndex['#' + self.attr(styleMaps[l], 'id')] = self.okhash(self.xml2str(styleMaps[l])).toString(16);
                var pairs = self.get(styleMaps[l], 'Pair');
                var pairsMap = {};
                for (var m = 0; m < pairs.length; m++) {
                    pairsMap[self.nodeVal(self.get1(pairs[m], 'key'))] = self.nodeVal(self.get1(pairs[m], 'styleUrl'));
                }
                styleMapIndex['#' + self.attr(styleMaps[l], 'id')] = pairsMap;

            }
            for (var j = 0; j < placemarks.length; j++) {
                gj.features = gj.features.concat(self.getPlacemark(placemarks[j]));
            }
            
            var features = [];

            gj.features.forEach(f=> {
                var esrijson = geojsonToArcGIS(f);
            
             
                features.push(esrijson);
            });
            self.addGeojsonToMap(features, file, "KML");
            self.uploadPanel.current.toggle();

        });


    }
    getPlacemark(root) {
        var geomsAndTimes = this.getGeometry(root), i, properties = {},
            name = this.nodeVal(this.get1(root, 'name')),
            address = this.nodeVal(this.get1(root, 'address')),
            styleUrl = this.nodeVal(this.get1(root, 'styleUrl')),
            styleIndex = {},
            styleMapIndex = {},
            styleByHash = {},
            description = this.nodeVal(this.get1(root, 'description')),
            timeSpan = this.get1(root, 'TimeSpan'),
            timeStamp = this.get1(root, 'TimeStamp'),
            extendedData = this.get1(root, 'ExtendedData'),
            lineStyle = this.get1(root, 'LineStyle'),
            polyStyle = this.get1(root, 'PolyStyle'),
            visibility = this.get1(root, 'visibility');

        if (!geomsAndTimes.geoms.length) return [];
        if (name) properties.name = name;
        if (address) properties.address = address;

        if (styleUrl) {
            if (styleUrl[0] !== '#') {
                styleUrl = '#' + styleUrl;
            }
            properties.styleUrl = styleUrl;
            if (styleIndex[styleUrl]) {
                properties.styleHash = styleIndex[styleUrl];
            }
            if (styleMapIndex[styleUrl]) {
                properties.styleMapHash = styleMapIndex[styleUrl];
                properties.styleHash = styleIndex[styleMapIndex[styleUrl].normal];
            }
            var style = styleByHash[properties.styleHash];
            if (style) {
                if (!lineStyle) lineStyle = this.get1(style, 'LineStyle');
                if (!polyStyle) polyStyle = this.get1(style, 'PolyStyle');
                var iconStyle = this.get1(style, 'IconStyle');
                if (iconStyle) {
                    var icon = this.get1(iconStyle, 'Icon');
                    if (icon) {
                        var href = this.nodeVal(this.get1(icon, 'href'));
                        if (href) properties.icon = href;
                    }
                }
            }
            if (description) properties.description = description;
            if (timeSpan) {
                var begin = this.nodeVal(this.get1(timeSpan, 'begin'));
                var end = this.nodeVal(this.get1(timeSpan, 'end'));
                properties.timespan = { begin: begin, end: end };
            }
            if (timeStamp) {
                properties.timestamp = this.nodeVal(this.get1(timeStamp, 'when'));
            }
            if (lineStyle) {
                var linestyles = this.kmlColor(this.nodeVal(this.get1(lineStyle, 'color'))),
                    color = linestyles[0],
                    opacity = linestyles[1],
                    width = parseFloat(this.nodeVal(this.get1(lineStyle, 'width')));
                if (color) properties.stroke = color;
                if (!isNaN(opacity)) properties['stroke-opacity'] = opacity;
                if (!isNaN(width)) properties['stroke-width'] = width;
            }
            if (polyStyle) {
                var polystyles = this.kmlColor(this.nodeVal(this.get1(polyStyle, 'color'))),
                    pcolor = polystyles[0],
                    popacity = polystyles[1],
                    fill = this.nodeVal(this.get1(polyStyle, 'fill')),
                    outline = this.nodeVal(this.get1(polyStyle, 'outline'));
                if (pcolor) properties.fill = pcolor;
                if (!isNaN(popacity)) properties['fill-opacity'] = popacity;
                if (fill) properties['fill-opacity'] = fill === '1' ? properties['fill-opacity'] || 1 : 0;
                if (outline) properties['stroke-opacity'] = outline === '1' ? properties['stroke-opacity'] || 1 : 0;
            }
            if (extendedData) {
                var datas = this.get(extendedData, 'Data'),
                    simpleDatas = this.get(extendedData, 'SimpleData');

                for (i = 0; i < datas.length; i++) {
                    properties[datas[i].getAttribute('name')] = this.nodeVal(this.get1(datas[i], 'value'));
                }
                for (i = 0; i < simpleDatas.length; i++) {
                    properties[simpleDatas[i].getAttribute('name')] = this.nodeVal(simpleDatas[i]);
                }
            }

            if (visibility) {
                properties.visibility = this.nodeVal(visibility);
            }

            if (geomsAndTimes.coordTimes.length) {
                properties.coordTimes = (geomsAndTimes.coordTimes.length === 1) ?
                    geomsAndTimes.coordTimes[0] : geomsAndTimes.coordTimes;
            }

            var feature = {
                type: 'Feature',
                geometry: (geomsAndTimes.geoms.length === 1) ? geomsAndTimes.geoms[0] : {
                    type: 'GeometryCollection',
                    geometries: geomsAndTimes.geoms
                },
                properties: properties
            };
            if (this.attr(root, 'id')) feature.id = this.attr(root, 'id');
            return [feature];

        } else {

            var feature = {
                type: 'Feature',
                geometry: (geomsAndTimes.geoms.length === 1) ? geomsAndTimes.geoms[0] : {
                    type: 'GeometryCollection',
                    geometries: geomsAndTimes.geoms
                },
                properties: properties
            };
            if (this.attr(root, 'id')) feature.id = this.attr(root, 'id');
            return [feature];

        }

    }

    processGeojsonFile(fileName, form) {

        var file = fileName.replace(/^.*[\\\/]/, '')
        var self = this;
        
        this.readTextFile(form.files[0]).then(text => {

            var geojson = JSON.parse(text);
            var features = [];

            geojson.features.forEach(f => {
                var esrijson = geojsonToArcGIS(f);


                features.push(esrijson);
            });

            self.addGeojsonToMap(features, file, "GEOJSON");
            self.uploadPanel.current.toggle();
        });

    }

    processShapeFile(fileName, form) {


        var self = this;
        self.uploadPanel.current.toggle();
        var name = fileName.split(".");
        name = name[0].replace("c:\\fakepath\\", "");

        var parms = {
            name: name,
            targetSR: self.state.view.extent.spatialReference,
            maxRecordCount: 1000,
            enforceInputFileSizeLimit: true,
            enforceOutputJsonSizeLimit: true,
        };

        parms.generalize = true;
        parms.maxAllowableOffset = 10;
        parms.reducePrecision = true;
        parms.numberOfDigitsAfterDecimal = 0;
        var myContent = {
            filetype: "shapefile",
            publishParameters: JSON.stringify(parms),
            f: "json",
            'content-type': 'multipart/form-data',
        };

        var portalUrl = "https://www.arcgis.com";

        var query = Object.keys(myContent)
            .map(k => escape(k) + '=' + escape(myContent[k]))
            .join('&');



        loadModules(['esri/request'])
            .then(([request]) => {
                request(portalUrl + "/sharing/rest/content/features/generate",
                    {
                        query: myContent,
                        body: new FormData(form.form),
                        //body: document.getElementById("uploadForm"),
                        responseType: "json"
                    })
                    .then(function (response) {
                        var layerName = response.data.featureCollection.layers[0].layerDefinition.name;
                        self.addShapefileToMap(response.data.featureCollection, layerName);
                    })
            })


    }

    addShapefileToMap(featureCollection, layerName) {
        var self = this;
        loadModules(['esri/Graphic', 'esri/layers/FeatureLayer', 'esri/layers/support/Field', 'esri/PopupTemplate'])
            .then(([Graphic, FeatureLayer, Field, PopupTemplate]) => {
                var sourceGraphics = [];
                var layers = featureCollection.layers.map(function (layer) {

                    var graphics = layer.featureSet.features.map(function (feature) {
                        var gfx = Graphic.fromJSON(feature);
                        gfx.symbol = {
                            type: "simple-fill", // autocasts as new SimpleFillSymbol()
                            color: "rgba(224, 206, 69, 0.8)",
                            style: "solid",
                            outline: {
                                color: "yellow",
                                width: 3
                            }
                        };
                        return gfx;
                    });
                    sourceGraphics = sourceGraphics.concat(graphics);
                    var featureLayer = new FeatureLayer({
                        title: "SHP File: " + layerName,
                        //objectIDField: "FID",
                        source: graphics,
                        fields: layer.layerDefinition.fields.map(function (field) {
                            return Field.fromJSON(field);
                        })
                    });
                    return featureLayer;

                });


                layers[0].title = layerName;


                self.state.map.addMany(layers);

                self.state.view.goTo(sourceGraphics);

                var props = {
                    title: "Shape File: " + layerName,
                    transparency: ".32",
                    identmaxzoom: "13",
                    blockidentselect: true,
                    type: "geojson",
                    src: "",
                    map: self.state.map,
                    view: self.state.view
                };

                var aml = new ArcticMapLayer(props);
                aml.layerRef = layers[0];
                aml.context = window._map.layers[0].context;
                aml.layerRef.title = props.title;

                self.state.map.amlayers.push(aml);

            });
    }


    addGeojsonToMap(featureCollection, layerName, filetype) {
        var self = this;
        loadModules(['esri/Graphic', 'esri/layers/FeatureLayer', 'esri/layers/support/Field', 'esri/PopupTemplate', "esri/renderers/SimpleRenderer"])
            .then(([Graphic, FeatureLayer, Field, PopupTemplate, SimpleRenderer]) => {
                var sourceGraphics = [];
                var symbol = {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: "rgba(224, 206, 69, 0.8)",
                    style: "solid",
                    outline: {
                        color: "red",
                        width: 2
                    }
                };

                var i = 0;
                var graphics = featureCollection.map(feature => {

                    feature.attributes["OBJECTID"] = i++;
                    var gfx = Graphic.fromJSON(feature);

                    gfx.symbol = symbol;
                    return gfx;

                });


                var featureLayer = new FeatureLayer({
                    title: filetype +" File: " + layerName,
                    objectIdField: "OBJECTID",
                    //renderer : SimpleRenderer.fromJSON(symbol) ,
                    source: graphics,
                    // fields: layer.layerDefinition.fields.map(function (field) {
                    //     return Field.fromJSON(field);
                    // })

                });


                self.state.map.add(featureLayer);
                self.state.view.goTo(graphics);




                var props = {
                    title: filetype +" File: " + layerName,
                    transparency: ".32",
                    identmaxzoom: "13",
                    blockidentselect: true,
                    type: "geojson",
                    src: "",
                    map: self.state.map,
                    view: self.state.view
                };

                var aml = new ArcticMapLayer(props);
                aml.layerRef = featureLayer;
                aml.context = window._map.layers[0].context;
                aml.layerRef.title = props.title;

                self.state.map.amlayers.push(aml);
            });
    }






    reset() {
        this.state.sketchViewModel.cancel();
        this.state.tempGraphicsLayer.removeAll();
        this.setState({ hideEditors: false, geojson: null });

    }

    setmaptoselect() {

        if (this.props.am.state.mode === "select") {
            this.props.am.setMode("view");
            this.setState({ mode: "view" });
        }
        else {

            this.props.am.setMode("select");
            this.setState({ mode: "select" });
        }
    }

    widgetRender() {

        var self = this;
        var children = React.Children.map(this.props.children, function (child) {

            return React.cloneElement(child, {


                map: self.state.map,
                view: self.state.view,
                //ref: 'child-' + (index++)
                hidden : self.state.hideEditors
            })

        })

        if (this.state.hidden === true) {
            return <div id="topbar"></div>;
        }

        return <div id="topbar">

            {this.state.hideEditors === false &&
                <span>
                    <ArcticMapButton showactive={this.props.am.state.mode === "select"} esriicon='cursor' title='Left click to select / Right click to deselect' onclick={this.setmaptoselect.bind(this)} />
                    {this.props.point &&

                        <ArcticMapButton esriicon="blank-map-pin" onclick={this.addPointClick.bind(this)} title="Draw point" ></ArcticMapButton>
                    }
                    {this.props.line &&

                        <ArcticMapButton esriicon="polyline" onclick={this.addLineClick.bind(this)} title="Draw polyline" ></ArcticMapButton>
                    }
                    {this.props.polygon &&

                        <ArcticMapButton esriicon="polygon" onclick={this.addPolyClick.bind(this)} title="Draw polygon" ></ArcticMapButton>
                    }
                    {this.props.square &&

                        <ArcticMapButton esriicon="checkbox-unchecked" onclick={this.addRecClick.bind(this)} title="Draw rectangle" ></ArcticMapButton>
                    }
                    {this.props.circle &&
                        <ArcticMapButton esriicon="radio-unchecked" onclick={this.addCircleClick.bind(this)} title="Draw circle" ></ArcticMapButton>

                    }
                </span>
            }
            {children}
            {this.props.upload &&
                <ArcticMapPanel hidden={this.state.hideEditors} esriicon="upload" title="Upload GIS file" ref={this.uploadPanel}  >
                    <br />
                    <p className={style.infoarea} >Do you already have a shape of your plot? Upload your file
                        here. Supported file types:
                        Shapefiles (.zip), kml, gml, gpx, and geojson
                    </p>
                    <form encType="multipart/form-data" method="post" id="uploadForm">
                        <div className="field">
                            <br/>
                            <label className={style.btm_primary_file}>
                                <input type="file" name="file" id="inFile"  onChange={this.fileUploaded.bind(this)} />
                                Upload File
                            </label>
                        </div>
                    </form>
                    <br />
                    <span id="upload-status"></span>

                </ArcticMapPanel>}
            <ArcticMapButton esriicon="erase" onclick={this.reset.bind(this)} title="Clear selection" ></ArcticMapButton>



        </div>;
    }

    componentDidUpdate() {
        if (this.top_right_node) {
            ReactDOM.render(
                this.widgetRender(),
                this.top_right_node
            );
        }
    }


    render() {

        //return (<h2>Test</h2>);


        return (<span>
            {this.state.fileLayer}



        </span>);
    }

    addGraphic(event) {
        // Create a new graphic and set its geometry to
        // `create-complete` event geometry.
        // const graphic = new Graphic({
        //     geometry: event.geometry,
        //     symbol: sketchViewModel.graphic.symbol
        // });
        // tempGraphicsLayer.add(graphic);
    }

    updateGraphic(event) {
        // event.graphic is the graphic that user clicked on and its geometry
        // has not been changed. Update its geometry and add it to the layer
        // event.graphic.geometry = event.geometry;
        // tempGraphicsLayer.add(event.graphic);

        // // set the editGraphic to null update is complete or cancelled.
        // editGraphic = null;
    }

    setUpClickHandler() {
        var self = this;
        self.state.view.on("click", function (event) {
            event.stopPropagation();

            self.state.view.hitTest(event).then(function (response) {
                var results = response.results;
                // Found a valid graphic
                if (results.length && results[results.length - 1].graphic && self.map.mode != 'identify') {
                    // Check if we're already editing a graphic
                    // if (!self.state.editGraphic) {
                    // Save a reference to the graphic we intend to update
                    self.state.editGraphic = results[results.length - 1].graphic;
                    // Remove the graphic from the GraphicsLayer
                    // Sketch will handle displaying the graphic while being updated
                    // self.state.tempGraphicsLayer.spatialReference = self.state.editGraphic.geometry.spatialReference;
                    // self.state.view.spatialReference = self.state.editGraphic.geometry.spatialReference;
                    //self.state.tempGraphicsLayer.remove(self.state.editGraphic);
                    self.state.tempGraphicsLayer.graphics = [self.state.editGraphic];
                    //self.state.sketchViewModel.updateGraphics = [self.state.editGraphic];

                    self.state.sketchViewModel.update([self.state.editGraphic]);

                    //self.state.tempGraphicsLayer.graphics = [self.state.editGraphic];

                    //}
                }
            });
        });
    }

    setActiveButton(selectedButton) {
        // focus the view to activate keyboard shortcuts for sketching
        // view.focus();
        // var elements = document.getElementsByClassName("active");
        // for (var i = 0; i < elements.length; i++) {
        //     elements[i].classList.remove("active");
        // }
        // if (selectedButton) {
        //     selectedButton.classList.add("active");
        // }
    }


}

export default ArcticMapEdit;