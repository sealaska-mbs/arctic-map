import React from "react";
import "./ArcticMap.css";

import { Map, loadModules } from 'react-arcgis';


class ArcticMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            map: null,
            view: null,
            hideBasemapButton: false
        };

        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
    }


    componentWillMount() {

    }


    render() {
        return <Map class="full-screen-map"
            mapProperties={{ basemap: 'hybrid' }} onLoad={this.handleMapLoad} onClick={this.handleMapClick} >
            {this.props.children}
            <div id="bottombar">
                {this.state.hideBasemapButton === false &&
                    <button className="action-button esri-icon-layers" id="pointButton"
                        type="button" title="Map Layers" onClick={this.handleShowBasemaps.bind(this)}></button>
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
        console.log(event);
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
            "esri/widgets/Zoom"
        ]).then(([
            LayerList,
            Locate,
            BasemapGallery,
            Home,
            Zoom
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


            view.on('click', (event) => {
                console.log(event);
                // need to work on identify and add to a single popup
                // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=tasks-identify
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
            this.basemapGallery.on("selection-change",function(){
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