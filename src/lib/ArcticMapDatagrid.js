import React from "react";
import ReactDOM from 'react-dom';
import ArcticMapPanel from './ArcticMapPanel';
import styles from './ArcticMapDatagrid.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import tabtyles from 'react-tabs/style/react-tabs.css';

import {
    loadModules
} from 'react-arcgis';

class ArcticMapDatagrid extends React.Component {
    static displayName = "ArcticMapDatagrid";
    constructor(props) {
        super(props)
        this.state = "review"
        console.log( "ArcticMapDatagrid constructor ", this);
        
        // const drawBox = props.view.on('drag', (event) => {
        //     console.log("view drag");
        //     this.drawTempGraphic(this.props.view, event);
        //     event.stopPropagation();
        // })
    }
    _getPrintLayout() {
        console.log("gridclick *****");
    }
    componentDidMount() {
      const {tabs} = this.state;
      console.log("componentDidMount  *****", this);
      loadModules([
        "dgrid/Grid",
        "dgrid/Selection",
        'dojo/_base/declare',
        'esri/layers/FeatureLayer',
      ]).then(([
        Grid,
        Selection,
        declare,
        FeatureLayer

      ]) => {
        var myGrid = declare([Grid, Selection]);
        console.log("myGrid", this);
        var caseFeatureLayer = new FeatureLayer({
          url: this.props.src,
          outFields: ["*"],
          visible: false
        });
        console.log("caseFeatureLayer", caseFeatureLayer);
        var query = caseFeatureLayer.createQuery();
        query.where = "1=1";
        query.outFields = [ "CSE_NR", "CSE_TYPE", "CSE_TYPE_NR", "LEG_CSE_NR", "STATUS", "CSE_META", "RCRD_ACRS", "GIS_ACRS", "PLSSIDS", "CMMDTY", "FRMTN", "EDOA", "PRDCNG", "OPRTR"];

        caseFeatureLayer.queryFeatures(query)
        .then(function(response){
          console.log("featureLayer.queryFeatures", response);
          // returns a feature set with features containing the following attributes
          // STATE_NAME, COUNTY_NAME, POPULATION, POP_DENSITY
          var featureColumns = response.fields.map( outField => {
            var newColumn = {
              'field': outField.name,
              'label': outField.alias}
            return newColumn;
          });
          console.log("featureColumns", featureColumns);
          var items = response.features.map(feature => {
            return feature.attributes;
          });
          console.log("items", items);
          var grid = new myGrid({
            columns: featureColumns, 
              selectionMode: 'single',
            }, "arcticmapdatagrid");
          grid.renderArray(items);;
        });

        //var featureColumns = [];
        

        var columns = [
          {'field': 'PARCELID', 'label': "Parcel ID"},
          {'field': 'OWNERNME1', 'label': 'Owner 1'},
          {'field': 'OWNERNME2', 'label': 'Owner 2'},
          {'field': 'RESYRBLT', 'label': 'Year Built'},
          {'field': 'SITEADDRESS', 'label': 'Street Address', width:"30%"} 
        ];

      
        

      })
    }
    
    
    render() {
        
        return (
            <div id="arcticmapdatagrid" className={styles.gridcontainer} >

            </div>
        )

    }

}

export default ArcticMapDatagrid;