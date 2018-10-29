import React from "react";
import ReactDOM from "react-dom";
import ArcticMap from './lib/ArcticMap'
import ArcticMapLayer from './lib/ArcticMapLayer'
import ArcticMapEdit from './lib/ArcticMapEdit'


ReactDOM.render(<div style={{ width: '100vw', height: '100vh' }}>
    <ArcticMap>



        <ArcticMapLayer
           // ref={(layer) => { this.layers.push(layer) }}
            type="dynamic"
            src="https://gis.blm.gov/arcgis/rest/services/admin_boundaries/BLM_Natl_AdminUnit/MapServer/" />


        <ArcticMapLayer
           // ref={(layer) => { this.layers.push(layer) }}
            type="dynamic"
            src="https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer" />



        <ArcticMapEdit single point line polygon square circle />

    </ArcticMap>
</div>, document.getElementById("root"));