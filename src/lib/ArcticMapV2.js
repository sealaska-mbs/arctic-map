import React, { useEffect, useRef } from 'react';

import ArcGISMap from 'esri/Map';
import MapView from 'esri/views/MapView';





class ArcticMapV2 extends React.Component {
    static displayName = 'ArcticMapV2';
 

    constructor(props) {
        super(props)

        this.mapRef = React.createRef();
        useEffect(
            () => {
                // create map
                var map = new ArcGISMap({
                    basemap: 'topo-vector'
                });

                // load the map view at the ref's DOM node
                var view = new MapView({
                    container: mapRef.current,
                    map: map,
                    center: [-118, 34],
                    zoom: 8
                });

                return () => {
                    if (view) {
                        // destroy the map view
                        view.container = null;
                    }
                };
            }
        );
    }

    render() {


        return <div className="webmap" ref={this.mapRef} />;
    }

}

export default ArcticMapV2