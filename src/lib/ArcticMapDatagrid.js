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

    onRowClickHandler(event) {
      console.log("onRowClickHandler", event.rows[0].data);
      
      
    }

    componentDidMount() {
      console.log("componentDidMount  *****", this);
      loadModules([
        "dgrid/Grid",
        "dgrid/Selection",
        'dojo/_base/declare',
        'esri/layers/FeatureLayer',
        'dojo/on'
      ]).then(([
        Grid,
        Selection,
        declare,
        FeatureLayer,
        on

      ]) => {
        var myGrid = declare([Grid, Selection]);
        var self = this;
        var caseFeatureLayer = new FeatureLayer({
          url: self.props.src,
          outFields: ["*"],
          visible: false
        });
        var query = caseFeatureLayer.createQuery();
        query.where = "1=1";
        query.outFields = [ "CSE_NR", "CSE_TYPE", "CSE_TYPE_NR", "LEG_CSE_NR", "STATUS", "CSE_META", "RCRD_ACRS", "GIS_ACRS", "PLSSIDS", "CMMDTY", "FRMTN", "EDOA", "PRDCNG", "OPRTR"];

        caseFeatureLayer.queryFeatures(query)
        .then(function(response){

          var featureColumns = response.fields.map( outField => {
            var hideColumn = false;
            if (outField.name == 'OBJECTID') {
              hideColumn = true;
            }
            var newColumn = {
              'field': outField.name,
              'label': outField.alias,
              hidden: hideColumn}
            return newColumn;
          });
          
          var items = response.features.map(feature => {
            return feature.attributes;
          });
          var grid = new myGrid({
            columns: featureColumns, 
              selectionMode: 'single',
            }, "arcticmapdatagrid");
          
          grid.renderArray(items);

          grid.on("dgrid-select", self.onRowClickHandler); 
        });


      
        

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