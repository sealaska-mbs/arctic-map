import React from 'react';
import async from 'async';
import './ArcticMap.css';

import { Map, loadModules } from 'react-arcgis'


class ArcticMap extends React.Component {
  static displayName = 'ArcticMap';
  constructor(props) {
    super(props)
    this.state = {
      map: null,
      view: null,
      hideBasemapButton: false,
      loading: false,
      lat: props.lat,
      lng: props.lng,
      basemap: props.basemap || "hybrid",
      sr: Number.parseInt(props.sr || "102100"),
    }

    this.handleMapLoad = this.handleMapLoad.bind(this)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.layers = []
  }



  render() {
    var self = this
    var index = 0
    this.layers = []

    self.childrenElements = [];

    var children = React.Children.map(this.props.children, function (child) {
      if (child.type.displayName === 'ArcticMapLayer') {
        return React.cloneElement(child, {
          ref: (c) => { if (c) { self.layers.push(c) } }
        })
      } else if (child.type.displayName === 'ArcticMapEdit') {
        // console.log(self.refs);
        return React.cloneElement(child, {
          // ref: 'editor'

        })

      }

      // else if (child.type.name === 'ArcticMapLLDSearch') {

      //   return React.cloneElement(child, {
      //   })

      // } 

      else {
        return React.cloneElement(child, {
          //ref: 'child-' + (index++)
          ref: (c) => { if (c) { self.childrenElements.push(c); } return 'child-' + (index++) }
        })
      }
    })

    if (children) {
      children = children.sort(l => l.type.displayName === 'ArcticMapEdit').reverse()
    } else {
      children = (<div />)
    }


    if (self.state.map) {
      self.state.map.amlayers = self.layers;
    }

    // console.log(this.props.children);
    // this.props.children.forEach((child) =>{
    //         child.ref = (c) => {this.layers.push(c) };
    // });

    return <Map class='full-screen-map'
      mapProperties={{ basemap: this.state.basemap }} onLoad={this.handleMapLoad} onClick={this.handleMapClick} >
      {children}
      <div id='bottombar' style={{ position: 'absolute', right: '10px', bottom: '20px' }}>
        {this.state.hideBasemapButton === false &&
          <button className='action-button esri-icon-layers' id='pointButton'
            type='button' title='Map Layers' onClick={this.handleShowBasemaps.bind(this)} />
        }
      </div>

      {/*  <div id='bottomleftbar'>
        {this.state.loading === true &&
         <p>Loading...</p>
        }
      </div>
      */}
    </Map>
  }

  handleShowBasemaps(event) {
    this.state.view.ui.add(this.basemapGallery, {
      position: 'bottom-right'
    })
    this.setState({ hideBasemapButton: true })
  }

  handleMapClick(event) {
    // console.log(event);
  }

  createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
  }


  setEdit(json, nofire, type) {
    if (nofire === null) {
      nofire = false;
    }

    if (type === null) {
      type = "polygon";
    }



    if (this.state.map.editor) {
      this.state.map.editor.setEditFeature(json, nofire, type);
    }
  }


  setJson(json) {
    if (this.state.map.editor) {
      this.state.map.editor.setEditFeature(json, true);
    }
  }


  handleMapLoad(map, view) {


    this.setState({ map, view })

    var self = this

    loadModules([
      'esri/widgets/LayerList',
      'esri/widgets/Locate',
      'esri/widgets/BasemapGallery',
      'esri/widgets/Home',
      'esri/widgets/Zoom',
      'esri/widgets/Search',
      // 'esri/tasks/Locator',
      'esri/geometry/geometryEngine',
      "esri/geometry/Polygon",
      "esri/request"
    ]).then(([
      LayerList,
      Locate,
      BasemapGallery,
      Home,
      Zoom,
      Search,
      // Locator,
      geometryEngine,
      Polygon,
      Request
    ]) => {
      window._request = Request;
      window._map = self;
      self.request = Request;

      //   self.state.view.spatialReference = {
      //     wkid: self.state.sr,
      //  };

      var layerList = new LayerList({
        view: self.state.view,
        listItemCreatedFunction: function (event) {
          const item = event.item
          item.panel = {
            content: 'legend',
            open: false
          }
        }
      })



      view.popup.dockEnabled = true
      view.popup.dockOptions.position = 'bottom-left'
      //var layers = React.Children.toArray(this.props.children).filter((ele) => ele.type.name === "ArcticMapLayer");



      // console.log(layers);
      view.popup.watch('selectedFeature', function (graphic) {
        if (graphic) {
          var graphicTemplate = graphic.getEffectivePopupTemplate()
          graphicTemplate.actions = [{
            id: 'select-item',
            title: 'Select',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTQyREM3RDkwQzVGMTFFNTk4QkI4OTBEOTYzQTg5MzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTQyREM3REEwQzVGMTFFNTk4QkI4OTBEOTYzQTg5MzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NDJEQzdENzBDNUYxMUU1OThCQjg5MEQ5NjNBODkzMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NDJEQzdEODBDNUYxMUU1OThCQjg5MEQ5NjNBODkzMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Prb3PqgAAACTSURBVHjaYvz//z8DJYCJgVJAjgsiIyMFQBjEZgQZwMjISJJmILUXynVmIdVmqGZ9qFAe0S7AonnR8uXLk5jItBmsGSUWgIriSdUMNwCoaB6QmgulidaM7AKYgjiYIcRohkdjVFQUhmIoG69mlHSAxUYGQppRAhGo6AMoYQDxRWI1Y02JSC65SEgz3IABzY0AAQYAhIhWWCl3Pj0AAAAASUVORK5CYII=",


          }]

          graphicTemplate.actions.items[0].visible = self.state.map.editor !== undefined// graphic.attributes.website ? true : false;
          //self.state.view.goTo(graphic);
        }
      })
      view.popup.viewModel.on('trigger-action', function (event) {
        if (event.action.id === 'select-item') {
          self.state.map.editor.setEditFeature(event.target.selectedFeature);
          view.popup.close();
        }
      })



      view.on('click', (event) => {
        // setTimeout(function () {

        if (self.state.hideBasemapButton && self.state.hideBasemapButton === true) {
          self.state.view.ui.remove(self.basemapGallery);
          self.setState({ hideBasemapButton: false });
          return;
        }
        //this.setState({ hideBasemapButton: true })

        if (self.state.map.editor && self.state.map.editor.state.editing === true) {
          return;
        }
        // console.log(event);
        // need to work on identify and add to a single popup
        // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=tasks-identify

        var identresults = [];
        //document.getElementsByClassName('esri-view-root')[0].style.cursor = 'wait';
        self.setState({ loading: true });

        var identLayers = self.layers.filter(function (layer) {
          var mapzoom = view.zoom;

          if (layer.props.identMaxZoom !== undefined) {
            if (Number.parseInt(layer.props.identMaxZoom, 10) > mapzoom) {
              return layer;
            }
          }

          return layer;

        });
        async.eachSeries(identLayers, function (layer, cb) {
          layer.identify(event, function (results) {
            if (results) {
              results.layer = layer;
              identresults.push(results);
            }
            cb();
          });
        }, function (err) {
          var results = identresults.map(function (ir) {
            ir.results.forEach(function (res) {
              res.layer = ir.layer;
              res.acres = -1;
              if (res.feature.geometry) {
                res.acres = geometryEngine.geodesicArea(res.feature.geometry, 'acres');
              }
            });
            return ir.results;
          }) || [].reduce(function (a, b) {
            return a.concat(b);
          });

          results = results.flat();

          results = results.sort(function (r1, r2) {
            return r1.acres > r2.acres;
            //r.feature.attributes.Shape_Area
          });

          //results = results.reverse();
          var popupresults = results.map(function (result) {
            var feature = result.feature;
            var layerName = result.layerName;

            feature.attributes.layerName = layerName;


            feature.popupTemplate = { // autocasts as new PopupTemplate()
              title: layerName,
              content: result.layer.renderPopup(feature, result),
              actions: [{ title: "Select", id: "select-action" }]
            };

            return feature;
          });

          if (popupresults.length > 0) {
            view.popup.close();
            view.popup.currentSearchResultFeature = null;
            self.state.view.popup.open({
              features: popupresults,
              location: event.mapPoint
            });
            popupresults[0].setCurrentPopup();

            self.state.view.popup.on('trigger-action', function (e) {
              if (e.action.id === 'select-action');
            });
          }
          self.setState({ loading: false });
          document.getElementsByClassName('esri-view-root')[0].style.cursor = 'auto';
        });

        // self.layers.forEach(layer => {
        //     layer.identify(event);
        // })
        //}, 100);

      })

      // Add widget to the top right corner of the view
      self.state.view.ui.add(layerList, 'top-left')


      if (this.props.locate) {
        var locateBtn = new Locate({
          view: self.state.view
        })

        self.state.view.ui.add(locateBtn, {
          position: 'top-right'
        })
      }

      this.basemapGallery = new BasemapGallery({
        view: self.state.view
      })

      this.basemapGallery.watch('activeBasemap', function (newValue, oldValue, property, object) {
        self.state.view.ui.remove(self.basemapGallery)
        self.setState({ hideBasemapButton: false })
      });


      map.on("basemap-change", function (a) {
        //this.basemapGallery.on('click', function () {

        alert("BM CHanegd")
      })


      // Add the widget to the top-right corner of the view

      if (this.props.home) {
        var homeBtn = new Home({
          view: view
        })

        // Add the home button to the top left corner of the view
        view.ui.add(homeBtn, 'top-right')
      }

      view.ui.remove('zoom')

      var zoom = new Zoom({
        view: self.state.view
      })

      view.ui.add(zoom, 'top-right')


      if (self.props.search) {

        // find search elemets
        var searchitems = self.childrenElements.filter(ele => {

          if (ele.constructor.name.toLowerCase().includes('search')) {
            return ele;
          }

        });

        var searchsources = searchitems.map(i => {
          if (i.search) { i.search(); }
        });






        var searchWidget = new Search({
          view: view,
          sources: searchsources,
          includeDefaultSources: true
        });

        searchWidget.on("search-complete", function (event) {

        });

        searchWidget.on('select-result', function (evt) {

          view.popup.currentSearchResultFeature = evt.result.feature;
          view.popup.close();
          // view.popup.open({
          //  location: evt.result.feature.geometry,  // location of the click on the view
          //  feature: evt.result.feature,
          //  title: "Search Result",  // title displayed in the popup
          //  content: evt.result.name, // content displayed in the popup
          // });
        });

        view.ui.add(searchWidget, {
          position: "top-right",
          index: 0
        });

      }

      //       var elestring = this.createElementFromHTML( `<input type="text" placeholder="Find address or place" aria-label="Search" autocomplete="off" tabindex="0" class="esri-input esri-search__input" aria-autocomplete="list" aria-haspopup="true" aria-owns="1687b00a338-widget-1-suggest-menu" role="textbox" data-node-ref="_inputNode" title="Find address or place">`);

      //  view.ui.add(elestring, {
      //         position: "top-right",
      //         index: 0
      //       });


      setTimeout(() => {
        var evt = new Event('mapready', { bubbles: true });
        Object.defineProperty(evt, 'target', { value: self, enumerable: true });

        if (self.props.onmapready) {
          self.props.onmapready(evt);
        }
      }, 500)



    })

  }


}

export default ArcticMap
