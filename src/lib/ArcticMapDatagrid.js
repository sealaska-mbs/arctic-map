import React from "react";
import ReactDOM from 'react-dom';
import ArcticMapPanel from './ArcticMapPanel';
import './ArcticMapDatagrid.css';

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
        console.log("componentDidMount  *****", this);
    }
    
    
    drawTempGraphic( view, event, am) {
        view.graphics.removeAll();
        console.log("drawTempGraphic", this);
        view.navigating = false;
        //w.toMap({ x: event.x, y: event.y });
        const pt1=view.toMap({x:event.origin.x, y:event.origin.y});
        const pt2=view.toMap({x:event.x, y:event.y})
        const rings= [
          [pt1.x, pt1.y],
          [pt1.x, pt2.y],      
          [pt2.x, pt2.y],
          [pt2.x, pt1.y]
        ]
        loadModules([
          'esri/geometry/Polygon',
          'esri/Graphic'
    
        ]).then(([
          Polygon,
          Graphic
    
        ]) => {
          const tempPolygon = new Polygon({
            hasz: false,
            hasm: false,
            rings: rings,
            spatialReference: view.spatialReference
          })
          const tempSymbol = {
            type: "simple-line",  // autocasts as new SimpleLineSymbol()
            color: [128,128,128],
            width: "5px",
            style: "solid"
          };
          const tempPolygonGraphic = new Graphic ({
            geometry: tempPolygon,
            symbol: tempSymbol
          })
          view.graphics.add(tempPolygonGraphic);
          
          if(event.action==="end"){
            view.graphics.removeAll();
            view.navigating = true;
            view.goTo([pt2,this.props.am.dragStart]);
            //drawBox.remove()
          }
        })
      }
    render() {
        
        return (
            <div class="arcticmapdatagrid">

            </div>
        )

    }

}

export default ArcticMapDatagrid;