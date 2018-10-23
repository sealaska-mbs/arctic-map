import React from "react";
import "./ArcticMap.css";

import { Map, loadModules } from 'react-arcgis';


class ArcticMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            map: null,
            view: null
        };

        this.handleMapLoad = this.handleMapLoad.bind(this)
    }


    componentWillMount() {

    }


    render() {
        return <Map class="full-screen-map"
            mapProperties={{ basemap: 'hybrid' }} onLoad={this.handleMapLoad} >
            {this.props.children}
            <div id="bottombar">
                <button className="action-button esri-icon-layers" id="pointButton" 
                    type="button" title="Map Layers"></button>
            </div>
        </Map>;
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

            // Add widget to the top right corner of the view
            self.state.view.ui.add(layerList, "top-left");


            var locateBtn = new Locate({
                view: self.state.view
            });

            self.state.view.ui.add(locateBtn, {
                position: "top-left"
            });

            var basemapGallery = new BasemapGallery({
                view: self.state.view
            });

            // Add the widget to the top-right corner of the view
            //   self.state.view.ui.add(basemapGallery, {
            //     position: "top-right"
            //   });

            var homeBtn = new Home({
                view: view
              });
        
              // Add the home button to the top left corner of the view
              view.ui.add(homeBtn, "top-left");

              view.ui.remove('zoom');

              var zoom = new Zoom({
                view: self.state.view
              });

              view.ui.add(zoom,  "top-left");

        });

    }
}

export default ArcticMap;