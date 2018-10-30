import React from "react";
import async from "async";
import "./ArcticMap.css";

import { Map, loadModules } from 'react-arcgis';


class ArcticMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            map: null,
            view: null,
            hideBasemapButton: false,
            loading: false
        };

        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.layers = [];
    }


    componentWillMount() {

    }


    render() {

        var self = this;
        var index = 0;
        this.layers = [];
        var children = React.Children.map(this.props.children, function (child) {
            if (child.type.name === "ArcticMapLayer") {
                return React.cloneElement(child, {
                    ref: (c) => { if (c) { self.layers.push(c) } }
                });
            }
            else if (child.type.name === "ArcticMapEdit") {
                return React.cloneElement(child, {
                    ref: 'editor'
                });
            }
            else {
                return React.cloneElement(child, {
                    ref: 'child-' + (index++)
                });
            }
        });
        children = children.sort(l => l.type.name === "ArcticMapEdit").reverse();


        // console.log(this.props.children);
        // this.props.children.forEach((child) =>{
        //         child.ref = (c) => {this.layers.push(c) };
        // });

        console.log(this.layers);
        return <Map class="full-screen-map"
            mapProperties={{ basemap: 'hybrid' }} onLoad={this.handleMapLoad} onClick={this.handleMapClick} >
            {children}
            <div id="bottombar">
                {this.state.hideBasemapButton === false &&
                    <button className="action-button esri-icon-layers" id="pointButton"
                        type="button" title="Map Layers" onClick={this.handleShowBasemaps.bind(this)}></button>
                }
            </div>

            <div id="bottomleftbar">
                {this.state.loading === true &&
                    <p>Loading...</p>
                }
            </div>
        </Map>;
    }


    handleShowBasemaps(event) {
        this.state.view.ui.add(this.basemapGallery, {
            position: "bottom-right"
        });
        this.setState({ hideBasemapButton: true })
    }

    handleMapClick(event) {
        //console.log(event);
    }

    handleMapLoad(map, view) {
        // var featureLayer = new FeatureLayer({
        //     url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
        // });

        // map.add(featureLayer);

        this.setState({ map, view });

        var self = this;
        loadModules([
            "esri/widgets/LayerList",
            "esri/widgets/Locate",
            "esri/widgets/BasemapGallery",
            "esri/widgets/Home",
            "esri/widgets/Zoom",
            "esri/geometry/geometryEngine"
        ]).then(([
            LayerList,
            Locate,
            BasemapGallery,
            Home,
            Zoom,
            geometryEngine
        ]) => {
            var layerList = new LayerList({
                view: self.state.view,
                listItemCreatedFunction: function (event) {
                    const item = event.item;
                    item.panel = {
                        content: "legend",
                        open: false
                    };
                }
            });

            view.popup.dockEnabled = true;
            view.popup.dockOptions.position = 'bottom-left';
            //var layers = React.Children.toArray(this.props.children).filter((ele) => ele.type.name === "ArcticMapLayer");


            // console.log(layers);
            view.popup.watch("selectedFeature", function (graphic) {
                if (graphic) {
                    var graphicTemplate = graphic.getEffectivePopupTemplate();
                    graphicTemplate.actions = [{
                        id: "select-item",
                        //image: "beer.png",
                        title: "Select"
                    }];
                    graphicTemplate.actions.items[0].visible = self.refs.editor !== undefined;// graphic.attributes.website ? true : false;
                    //self.state.view.goTo(graphic);
                }
            });
            view.popup.viewModel.on("trigger-action", function (event) {
                if (event.action.id === "select-item") {
                    // do something
                    //console.log(event.target.selectedFeature);
                    self.refs.editor.setEditFeature(event.target.selectedFeature);
                }
            });

            var popup = view.popup;

            view.on('click', (event) => {
                if(this.refs.editor && this.refs.editor.state.editing === true){
                    return;
                }
                //console.log(event);
                // need to work on identify and add to a single popup
                // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=tasks-identify

                var identresults = [];
                document.getElementsByClassName("esri-view-root")[0].style.cursor = "wait";
                this.setState({ loading: true });
                view.popup.close();

                async.eachSeries(self.layers, (layer, cb) => {

                    layer.identify(event, (results) => {
                        results.layer = layer;
                        identresults.push(results);
                        cb();
                    });
                }, (err) => {




                    var results = identresults.map(ir => {
                        ir.results.forEach(res => {
                            res.layer = ir.layer;
                            res.acres = geometryEngine.geodesicArea(res.feature.geometry, "acres");
                        });
                        return ir.results;
                    }).reduce(function (a, b) { return a.concat(b); });
       
                    console.log(results);
                    results.sort((r1, r2)=> {
                  
                        return r1.acres > r2.acres;
                        //r.feature.attributes.Shape_Area
                    });

              
            
                    //results = results.reverse();
                    var popupresults = results.map(function (result) {

                        var feature = result.feature;
                        var layerName = result.layerName;

                        feature.attributes.layerName = layerName;
      

                        var displayValue = result.feature.attributes[result.displayFieldName];


                        feature.popupTemplate = { // autocasts as new PopupTemplate()
                            title: layerName,
                            content: result.layer.renderPopup(feature),

                        };



                        return feature;
                    });

                    if (popupresults.length > 0) {
                        self.state.view.popup.open({
                            features: popupresults,
                            location: event.mapPoint
                        });
                    }
                    this.setState({ loading: false });
                    document.getElementsByClassName("esri-view-root")[0].style.cursor = "auto";

                });

                // self.layers.forEach(layer => {
                //     layer.identify(event);
                // })



            });

            // Add widget to the top right corner of the view
            self.state.view.ui.add(layerList, "top-left");


            var locateBtn = new Locate({
                view: self.state.view
            });

            self.state.view.ui.add(locateBtn, {
                position: "top-right"
            });

            this.basemapGallery = new BasemapGallery({
                view: self.state.view
            });
            this.basemapGallery.on("selection-change", function () {
                console.log('Basemap Changed');
            });


            // Add the widget to the top-right corner of the view


            var homeBtn = new Home({
                view: view
            });

            // Add the home button to the top left corner of the view
            view.ui.add(homeBtn, "top-right");

            view.ui.remove('zoom');

            var zoom = new Zoom({
                view: self.state.view
            });

            view.ui.add(zoom, "top-right");

        });

    }
}

export default ArcticMap;