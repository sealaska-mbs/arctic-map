import React from "react";
import request from "@arcgis/core/request.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import * as Locator from "@arcgis/core/rest/locator.js";
import Search from "@arcgis/core/widgets/Search.js";


class ArcticMapLocator extends React.Component {
    static displayName = "ArcticMapLocator";
    constructor(props) {
        super(props);

    }

    

//    componentWillMount() {
//
//    }

    componentDidMount() {
        var self = this;
        var searchsources = []
        
        var devaultSource = {
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
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
            var graph = evt.result.feature;
            graph.symbol = new SimpleFillSymbol({
              color: [135, 206, 235, 0.5],
              style: "solid",
              outline: {
                  color: [0, 191, 255],
                  width: 1
              }
          });

            self.props.view.popup.currentSearchResultFeature = graph;
            self.props.view.popup.close();
          });
    }
    render() {
        return null;
    }
}

export default ArcticMapLocator;
