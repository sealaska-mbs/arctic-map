import React from "react";
import ReactDOM from "react-dom";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import ArcticMapButton from './ArcticMapButton';
import ArcticMapPanel from './ArcticMapPanel';
import ArcticMapLayer from './ArcticMapLayer';
//import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';
import './ArcticMapEdit.css'







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
            showUploading :false,
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
            "esri/geometry/Polygon"
        ]).then(([
            Graphic,
            GraphicsLayer,
            SketchViewModel,
            Geometry,
            Polygon
        ]) => {
            const tempGraphicsLayer = new GraphicsLayer({ title: 'Edit Layer', listMode: "hide" });
            self.setState({ tempGraphicsLayer });

            self.state.map.add(tempGraphicsLayer);


            const sketchViewModel = new SketchViewModel({
                view: self.state.view,
                layer: tempGraphicsLayer,
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

                console.log("UPDATED");

            });



            this.top_right_node = document.createElement("div");
            self.state.view.ui.add(this.top_right_node, "top-right");

            self.setState({ loaded: true })

            //self.setUpClickHandler();


            // scoped methods
            self.setEditFeature = (feature, nofire, type) => {
                if (nofire === null) {
                    nofire = false;
                }

                if (type === null) {
                    type = "polygon";
                }


                if (!feature.geometry.type) {
                    if (type === "polygon") {

                        feature.geometry = new Polygon(feature.geometry);
                        feature.geometry.type = "polygon";
                    }
                }

                this.state.sketchViewModel.cancel();
                this.state.tempGraphicsLayer.removeAll();
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

                //console.log(feature);
                //this.state.tempGraphicsLayer.add(graphic);
                this.state.tempGraphicsLayer.graphics = [graphic];
                if (this.props.single) {

                    this.setState({ hideEditors: true });
                }

                self.state.view.goTo(graphic);


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
        console.log(fileName);
        if (fileName.indexOf(".zip" !== -1)) {
            // console.log("addEventListener", self);
            self.processShapeFile(fileName,  evt.target);
        } else {
            document.getElementById("upload-status").innerHTML +
                '<p style="color:red">Add shapefile as .zip file</p>'
        }


    }

    processShapeFile(fileName, form){


        var self = this;
        self.uploadPanel.current.toggle();
        console.log("Process Shape File", fileName);
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
                        body : new FormData( form.form),
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
        loadModules(['esri/Graphic', 'esri/layers/FeatureLayer','esri/layers/support/Field','esri/PopupTemplate'])
            .then(([Graphic, FeatureLayer, Field, PopupTemplate]) => {
                var sourceGraphics = [];
                var layers = featureCollection.layers.map(function (layer) {
                
                    var graphics = layer.featureSet.features.map(function (feature) {
                        console.log("layer.featureSet.feature.map", feature);
                        return Graphic.fromJSON(feature);
                    });
                    sourceGraphics = sourceGraphics.concat(graphics);
                    var featureLayer = new FeatureLayer({
                        title: "Shape File: " + layerName,
                        //objectIDField: "FID",
                        source: graphics,
                        fields: layer.layerDefinition.fields.map(function (field) {
                            return Field.fromJSON(field);
                        })
                    });
                    return featureLayer;

                });

                // var popupTemplate = new PopupTemplate({
                //     title: layerName,
                //     content: [
                //         {
                //             type: "fields",
                //             fieldInfos: [
                //                 {
                //                     fieldName: "FID",
                //                     label: "objectIDField"
                //                 }

                //             ]
                //         }
                //     ]
                // })
                layers[0].title = layerName;
                //layers[0].popupTemplate = popupTemplate;

                self.state.map.addMany(layers);
                
                self.state.view.goTo(sourceGraphics);
             
                var props = {
                    title: "Shape File: " + layerName,
                    transparency: ".32",
                    identmaxzoom: "13",
                    blockidentselect: true,
                    type: layers[0].type,
                    src: "",
                    map: self.state.map,
                    view: self.state.view
                };

                var aml = new ArcticMapLayer(props);
                aml.layerRef = layers[0];
                aml.context =  self.state.map.amlayers[0].context;
                aml.layerRef.title = props.title;
                //aml.componentDidMount();
                //console.log("aml", aml);
                self.state.map.amlayers.push(aml);
                     });
    }





    reset() {
        this.state.sketchViewModel.cancel();
        this.state.tempGraphicsLayer.removeAll();
        this.setState({ hideEditors: false, geojson: null });

    }

    widgetRender() {
        return <div id="topbar">
            {this.state.hideEditors === false &&
                <span>
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
                    {this.props.upload &&
                        <ArcticMapPanel esriicon="upload" title="Upload Polygon" ref={this.uploadPanel}  >
                            <br />
                            <form encType="multipart/form-data" method="post" id="uploadForm">
                                <div className="field">
                                    <label className="file-upload">
                                        <p><strong>Select File</strong></p>
                                        <input type="file" name="file" id="inFile" onChange={this.fileUploaded.bind(this)} />
                                    </label>
                                </div>
                            </form>
                            <br />
                            <span id="upload-status"></span>

                        </ArcticMapPanel>}
                </span>
            }
            <ArcticMapButton esriicon="trash" onclick={this.reset.bind(this)} title="Clear graphics" ></ArcticMapButton>




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
            console.log("HERE!!")
            self.state.view.hitTest(event).then(function (response) {
                var results = response.results;
                // Found a valid graphic
                if (results.length && results[results.length - 1].graphic) {
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