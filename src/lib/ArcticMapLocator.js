import React from "react";
import ReactDOM from 'react-dom'

//import { loadModules } from 'react-arcgis';
import Locate from '@arcgis/core/widgets/Locate.js';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js';
import Home from '@arcgis/core/widgets/Home.js';
import Search from '@arcgis/core/widgets/Search.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import * as locator from '@arcgis/core/rest/locator.js';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';
import esriRequest from '@arcgis/core/request.js';


class ArcticMapLocator extends React.Component {
    static displayName = "ArcticMapLocator";
    constructor(props) {
        super(props);

    }

    componentWillMount() {

    }

    componentDidMount() {
        var self = this;
//        loadModules([
//
//            'esri/widgets/Locate',
//            'esri/widgets/BasemapGallery',
//            'esri/widgets/Home',
//      
//            'esri/widgets/Search',
//            'esri/layers/FeatureLayer',
//            'esri/tasks/Locator',
//            'esri/geometry/geometryEngine',
//      
//            "esri/request",
//      
//          ]).then(([
//     
//            Locate,
//            BasemapGallery,
//            Home,
//      
//            Search,
//            FeatureLayer,
//            Locator,
//            geometryEngine,
//      
//            Request,
//      
//          ]) => {
            var searchsources = []
            
            
            var devaultSource = {
              locator: new locator({ url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
              singleLineFieldName: "SingleLine",
              name: "Standard Geocoder",
              placeholder: "Find address",
              maxResults: 3,
              maxSuggestions: 6,
              suggestionsEnabled: true,
              minSuggestCharacters: 0
            }
            searchsources.push(devaultSource);
            var searchitems = self.props.am.childrenElements.filter(ele => {

                if (ele.search) {
                  return ele;
                }
                // if (ele.constructor.name.toLowerCase().includes('search')) {
                //   return ele;
                // }
      
              });

            var lldsSarchsources = searchitems.map(i => {
                if (i.search) { return i.search; }
            });

            searchsources.push(lldsSarchsources[0]);
           
            if (self.props.searchSources) {
                self.props.searchSources.map(searchSource => {
                  
                  var searchFeature = new FeatureLayer({
                    url: searchSource.scr + searchSource.layerid
                  });
                  searchSource.layer=searchFeature;
    
                  searchsources.push(searchSource);
                })
              }

            let locationServicesEnabled = true;  
            if (self.props.locationServicesEnabled !== undefined) {
              locationServicesEnabled = self.props.locationServicesEnabled;
            }

            var searchWidget2 = new Search({
                view: self.props.view,
                sources: searchsources,
                includeDefaultSources: false, // true will include standard locator
                locationEnabled: locationServicesEnabled
            });

            self.props.view.ui.add(searchWidget2, {
                position: "top-right",
                index: 1
            });

            searchWidget2.on('select-result', function (evt) {

                self.props.view.popup.currentSearchResultFeature = evt.result.feature;
                self.props.view.popup.close();
                //self.props.view.popup.close();
                // view.popup.open({
                //  location: evt.result.feature.geometry,  // location of the click on the view
                //  feature: evt.result.feature,
                //  title: "Search Result",  // title displayed in the popup
                //  content: evt.result.name, // content displayed in the popup
                // });
              });

//        });


    }
    render() {
        return null;
    }
}

export default ArcticMapLocator;