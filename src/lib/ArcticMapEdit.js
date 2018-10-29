import React from "react";
import ReactDOM from "react-dom";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
//import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';
import './ArcticMapEdit.css'


import {
    loadModules
} from 'react-arcgis';

class ArcticMapEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            map: props.map,
            view: props.view,
            graphic: null,
            hideEditors: false,
            editing: false,
        };
    }

    componentWillUnmount() {
        this.props.view.graphics.remove(this.state.graphic);
    }

    componentWillMount() {
        var self = this;
        loadModules(["esri/Graphic",
            "esri/layers/GraphicsLayer",
            "esri/widgets/Sketch/SketchViewModel",
        ]).then(([
            Graphic,
            GraphicsLayer,
            SketchViewModel
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

            sketchViewModel.on("create-complete", (event) => {
                const graphic = new Graphic({
                    geometry: event.geometry,
                    symbol: sketchViewModel.graphic.symbol
                });
                tempGraphicsLayer.add(graphic);
                if (this.props.single) {
                    console.log("Added one feature");
                    this.setState({ hideEditors: true });
                }

                this.setState({ geojson: arcgisToGeoJSON(event.geometry.toJSON()), editing: false });
                //this.geojson = event.geometry;

            });

            // Listen the sketchViewModel's update-complete and update-cancel events
            sketchViewModel.on("update-complete", (event) => {
                event.graphic.geometry = event.geometry;
                tempGraphicsLayer.add(event.graphic);

                // set the editGraphic to null update is complete or cancelled.
                self.state.editGraphic = null;
            });
            sketchViewModel.on("update-cancel", (event) => {
                event.graphic.geometry = event.geometry;
                tempGraphicsLayer.add(event.graphic);

                // set the editGraphic to null update is complete or cancelled.
                self.state.editGraphic = null;
            });


            this.top_right_node = document.createElement("div");
            self.state.view.ui.add(this.top_right_node, "top-right");

            self.setState({ loaded: true })


            // scoped methods
            self.setEditFeature = (feature) => {

                this.state.sketchViewModel.reset();
                this.state.tempGraphicsLayer.removeAll();
                this.setState({ hideEditors: false, geojson: null });


                const graphic = new Graphic({
                    geometry: feature.geometry,
                    symbol: this.state.sketchViewModel.polygonSymbol
                });

                //console.log(feature);
                this.state.tempGraphicsLayer.add(graphic);
                if (this.props.single) {
                    console.log("Added one feature");
                    this.setState({ hideEditors: true });
                }

                self.state.view.goTo(graphic);


                this.setState({ geojson: arcgisToGeoJSON(feature.geometry.toJSON()) });
            };
            self.setEditFeature = self.setEditFeature.bind(self);


        }); //.catch ((err) => console.error(err));
    }

    addPointClick() {
        this.state.sketchViewModel.create("point", {mode: "click"});
        this.setState({editing : true});
    }

    addLineClick() {
        this.state.sketchViewModel.create("polyline", {mode: "click"});
        this.setState({editing : true});
    }
    addPolyClick() {
        this.state.sketchViewModel.create("polygon", {mode: "click"});
        this.setState({editing : true});
    }
    addRecClick() {
        this.state.sketchViewModel.create("rectangle", {mode: "click"});
        this.setState({editing : true});
    }
    addCircleClick() {
        this.state.sketchViewModel.create("circle", {mode: "click"});
        this.setState({editing : true});
    }



    reset() {
        this.state.sketchViewModel.reset();
        this.state.tempGraphicsLayer.removeAll();
        this.setState({ hideEditors: false, geojson: null });

    }

    widgetRender() {
        return <div id="topbar">
            {this.state.hideEditors === false &&
                <span>
                    {this.props.point &&
                        <button className="action-button esri-icon-blank-map-pin" id="pointButton" onClick={this.addPointClick.bind(this)}
                            type="button" title="Draw point"></button>
                    }
                    {this.props.line &&
                        <button className="action-button esri-icon-polyline" id="polylineButton" type="button" onClick={this.addLineClick.bind(this)}
                            title="Draw polyline"></button>
                    }
                    {this.props.polygon &&
                        <button className="action-button esri-icon-polygon" id="polygonButton" type="button" onClick={this.addPolyClick.bind(this)}
                            title="Draw polygon"></button>
                    }
                    {this.props.square &&
                        <button className="action-button esri-icon-checkbox-unchecked" id="rectangleButton" onClick={this.addRecClick.bind(this)}
                            type="button" title="Draw rectangle"></button>
                    }
                    {this.props.circle &&
                        <button className="action-button esri-icon-radio-unchecked" id="circleButton" onClick={this.addCircleClick.bind(this)}
                            type="button" title="Draw circle"></button>
                    }
                </span>
            }
            <button className="action-button esri-icon-trash" id="resetBtn" type="button" onClick={this.reset.bind(this)}
                title="Clear graphics"></button>
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


        return (<span></span>);
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
            self.state.view.hitTest(event).then(function (response) {
                var results = response.results;
                // Found a valid graphic
                if (results.length && results[results.length - 1].graphic) {
                    // Check if we're already editing a graphic
                    if (!self.state.editGraphic) {
                        // Save a reference to the graphic we intend to update
                        self.state.editGraphic = results[results.length - 1].graphic;
                        // Remove the graphic from the GraphicsLayer
                        // Sketch will handle displaying the graphic while being updated
                        self.state.tempGraphicsLayer.remove(self.state.editGraphic);
                        self.state.sketchViewModel.update(self.state.editGraphic);
                    }
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