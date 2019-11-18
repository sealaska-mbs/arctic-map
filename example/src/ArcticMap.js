'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var async = _interopDefault(require('async'));
var reactArcgis = require('react-arcgis');
var ReactDOM = _interopDefault(require('react-dom'));
var arcgisToGeojsonUtils = require('@esri/arcgis-to-geojson-utils');

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".ArcticMap_simple-form-group__3yxCc {\r\n    margin-bottom: 1rem;\r\n  }\r\n  .ArcticMap_simple-text-label__JFxOr {\r\n    display: block;\r\n    color: red;\r\n  }\r\n  .ArcticMap_simple-text-input__2Da66 {\r\n    display: inline-block;\r\n    margin-bottom: 0.5rem;\r\n    font-size: 16px;\r\n    font-weight: 400;\r\n    color: rgb(33, 37, 41);\r\n  }\r\n\r\n#ArcticMap_bottomleftbar__1Odoz{\r\n  background: #fff;\r\n  position: absolute;\r\n  bottom: 30px;\r\n  left: 15px;\r\n  padding: 0px;\r\n  font-family: 'Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif'\r\n}\r\n\r\n#ArcticMap_bottomleftbar__1Odoz p{\r\n  padding-left: 12px;\r\n  padding-right: 12px;\r\n}\r\n  \r\n#ArcticMap_bottombar__qE1e6 {\r\n    background: #fff;\r\n    position: absolute;\r\n    bottom: 30px;\r\n    right: 15px;\r\n    padding: 0;\r\n  }\r\n\r\n  .ArcticMap_action-button__MaMS6 {\r\n    font-size: 16px;\r\n    background-color: transparent;\r\n    border: 1px solid #D3D3D3;\r\n    color: #6e6e6e;\r\n    height: 32px;\r\n    width: 32px;\r\n    text-align: center;\r\n    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);\r\n  }\r\n\r\n  .ArcticMap_action-button__MaMS6:hover,\r\n  .ArcticMap_action-button__MaMS6:focus {\r\n    background: #0079c1;\r\n    color: #e4e4e4;\r\n  }\r\n\r\n  .ArcticMap_active__1K4ZI {\r\n    background: #0079c1;\r\n    color: #e4e4e4;\r\n  }";
styleInject(css);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var ArcticMap$1 = function (_React$Component) {
  inherits(ArcticMap, _React$Component);

  function ArcticMap(props) {
    classCallCheck(this, ArcticMap);

    var _this = possibleConstructorReturn(this, (ArcticMap.__proto__ || Object.getPrototypeOf(ArcticMap)).call(this, props));

    _this.state = {
      map: null,
      view: null,
      hideBasemapButton: false,
      loading: false,
      lat: props.lat,
      lng: props.lng,
      basemap: props.basemap || "hybrid"
    };

    _this.handleMapLoad = _this.handleMapLoad.bind(_this);
    _this.handleMapClick = _this.handleMapClick.bind(_this);
    _this.layers = [];
    return _this;
  }

  createClass(ArcticMap, [{
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var index = 0;
      this.layers = [];

      self.childrenElements = [];

      var children = React.Children.map(this.props.children, function (child) {
        if (child.type.displayName === 'ArcticMapLayer') {
          return React.cloneElement(child, {
            ref: function ref(c) {
              if (c) {
                self.layers.push(c);
              }
            }
          });
        } else if (child.type.displayName === 'ArcticMapEdit') {
          // console.log(self.refs);
          return React.cloneElement(child, {
            // ref: 'editor'

          });
        }

        // else if (child.type.name === 'ArcticMapLLDSearch') {

        //   return React.cloneElement(child, {
        //   })

        // } 

        else {
            return React.cloneElement(child, {
              //ref: 'child-' + (index++)
              ref: function ref(c) {
                if (c) {
                  self.childrenElements.push(c);
                }return 'child-' + index++;
              }
            });
          }
      });

      if (children) {
        children = children.sort(function (l) {
          return l.type.displayName === 'ArcticMapEdit';
        }).reverse();
      } else {
        children = React.createElement('div', null);
      }

      // console.log(this.props.children);
      // this.props.children.forEach((child) =>{
      //         child.ref = (c) => {this.layers.push(c) };
      // });

      return React.createElement(
        reactArcgis.Map,
        { 'class': 'full-screen-map',
          mapProperties: { basemap: this.state.basemap }, onLoad: this.handleMapLoad, onClick: this.handleMapClick },
        children,
        React.createElement(
          'div',
          { id: 'bottombar', style: { position: 'absolute', right: '10px', bottom: '20px' } },
          this.state.hideBasemapButton === false && React.createElement('button', { className: 'action-button esri-icon-layers', id: 'pointButton',
            type: 'button', title: 'Map Layers', onClick: this.handleShowBasemaps.bind(this) })
        )
      );
    }
  }, {
    key: 'handleShowBasemaps',
    value: function handleShowBasemaps(event) {
      this.state.view.ui.add(this.basemapGallery, {
        position: 'bottom-right'
      });
      this.setState({ hideBasemapButton: true });
    }
  }, {
    key: 'handleMapClick',
    value: function handleMapClick(event) {
      // console.log(event);
    }
  }, {
    key: 'createElementFromHTML',
    value: function createElementFromHTML(htmlString) {
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim();

      // Change this to div.childNodes to support multiple top-level nodes
      return div.firstChild;
    }
  }, {
    key: 'setJson',
    value: function setJson(json) {
      if (this.state.map.editor) {
        this.state.map.editor.setEditFeature(json, true);
      }
    }
  }, {
    key: 'handleMapLoad',
    value: function handleMapLoad(map, view) {
      var _this2 = this;

      // var featureLayer = new FeatureLayer({
      //     url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
      // });

      // map.add(featureLayer);

      this.setState({ map: map, view: view });

      var self = this;

      reactArcgis.loadModules(['esri/widgets/LayerList', 'esri/widgets/Locate', 'esri/widgets/BasemapGallery', 'esri/widgets/Home', 'esri/widgets/Zoom', 'esri/widgets/Search', 'esri/tasks/Locator', 'esri/geometry/geometryEngine']).then(function (_ref) {
        var _ref2 = slicedToArray(_ref, 8),
            LayerList = _ref2[0],
            Locate = _ref2[1],
            BasemapGallery = _ref2[2],
            Home = _ref2[3],
            Zoom = _ref2[4],
            Search = _ref2[5],
            Locator = _ref2[6],
            geometryEngine = _ref2[7];

        window._map = self;

        var layerList = new LayerList({
          view: self.state.view,
          listItemCreatedFunction: function listItemCreatedFunction(event) {
            var item = event.item;
            item.panel = {
              content: 'legend',
              open: false
            };
          }
        });

        view.popup.dockEnabled = true;
        view.popup.dockOptions.position = 'bottom-left';
        //var layers = React.Children.toArray(this.props.children).filter((ele) => ele.type.name === "ArcticMapLayer");


        // console.log(layers);
        view.popup.watch('selectedFeature', function (graphic) {
          if (graphic) {
            var graphicTemplate = graphic.getEffectivePopupTemplate();
            graphicTemplate.actions = [{
              id: 'select-item',
              // image: "beer.png",
              title: 'Select'
            }];

            graphicTemplate.actions.items[0].visible = self.state.map.editor !== undefined; // graphic.attributes.website ? true : false;
            //self.state.view.goTo(graphic);
          }
        });
        view.popup.viewModel.on('trigger-action', function (event) {
          if (event.action.id === 'select-item') {
            // do something
            // console.log(event.target.selectedFeature);
            // if (view.popup.currentSearchResultFeature) {
            //   self.state.map.editor.setEditFeature(view.popup.currentSearchResultFeature);
            //   //view.popup.currentSearchResultFeature = null;
            // }
            // else {

            self.state.map.editor.setEditFeature(event.target.selectedFeature);
            //}
          }
        });

        var popup = view.popup;

        view.on('click', function (event) {
          setTimeout(function () {

            if (self.state.hideBasemapButton && self.state.hideBasemapButton == true) {
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
              console.log("Filter layers");

              if (layer.props.identMaxZoom !== undefined) {
                if (Number.parseInt(layer.props.identMaxZoom) > mapzoom) {
                  return layer;
                }
              }
              // else if(layer.props.identMinZoom !== undefined){
              //   if (Number.parseInt(layer.props.identMinZoom) > mapzoom
              //   ) {
              //     return layer;
              //   }
              // }
              else {
                  return layer;
                }
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

                var displayValue = result.feature.attributes[result.displayFieldName];

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
                  if (e.action.id === 'select-action') ;
                });
              }
              self.setState({ loading: false });
              document.getElementsByClassName('esri-view-root')[0].style.cursor = 'auto';
            });

            // self.layers.forEach(layer => {
            //     layer.identify(event);
            // })
          }, 100);
        });

        // Add widget to the top right corner of the view
        self.state.view.ui.add(layerList, 'top-left');

        var locateBtn = new Locate({
          view: self.state.view
        });

        self.state.view.ui.add(locateBtn, {
          position: 'top-right'
        });

        _this2.basemapGallery = new BasemapGallery({
          view: self.state.view
        });

        var handle = _this2.basemapGallery.watch('activeBasemap', function (newValue, oldValue, property, object) {
          self.state.view.ui.remove(self.basemapGallery);
          self.setState({ hideBasemapButton: false });
        });

        map.on("basemap-change", function (a) {
          //this.basemapGallery.on('click', function () {

          alert("BM CHanegd");
        });

        // Add the widget to the top-right corner of the view


        var homeBtn = new Home({
          view: view
        });

        // Add the home button to the top left corner of the view
        view.ui.add(homeBtn, 'top-right');

        view.ui.remove('zoom');

        var zoom = new Zoom({
          view: self.state.view
        });

        view.ui.add(zoom, 'top-right');

        if (self.props.search) {

          // find search elemets
          var searchitems = self.childrenElements.filter(function (ele) {

            if (ele.constructor.name.toLowerCase().includes('search')) {
              return ele;
            }
          });
          console.log(searchitems);

          var searchsources = searchitems.map(function (i) {
            return i.search();
          });

          var searchWidget = new Search({
            view: view,
            sources: searchsources,
            includeDefaultSources: true
          });

          searchWidget.on("search-complete", function (event) {
            console.log("Serach Complete");
            console.log(event);
          });

          searchWidget.on('select-result', function (evt) {
            console.info(evt);
            view.popup.currentSearchResultFeature = evt.result.feature;
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


        setTimeout(function () {
          var evt = new Event('mapready', { bubbles: true });
          Object.defineProperty(evt, 'target', { value: self, enumerable: true });

          if (self.props.onmapready) {
            self.props.onmapready(evt);
          }
        }, 500);
      });
    }
  }]);
  return ArcticMap;
}(React.Component);

ArcticMap$1.displayName = 'ArcticMap';

var css$1 = "\r\n#ArcticMapEdit_topbar__2WB6X {\r\n    background: #fff;\r\n   \r\n   \r\n    padding: 2px;\r\n  }\r\n\r\n  .ArcticMapEdit_action-button__3NbvD {\r\n    display: block;\r\n    font-size: 16px;\r\n    background-color: transparent;\r\n    border: 1px solid #D3D3D3;\r\n    color: #6e6e6e;\r\n    height: 32px;\r\n    width: 32px;\r\n    text-align: center;\r\n    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);\r\n    padding: 2px;\r\n  }\r\n\r\n  .ArcticMapEdit_action-button__3NbvD:hover,\r\n  .ArcticMapEdit_action-button__3NbvD:focus {\r\n    background: #0079c1;\r\n    color: #e4e4e4;\r\n  }\r\n\r\n  .ArcticMapEdit_active__2wj6f {\r\n    background: #0079c1;\r\n    color: #e4e4e4;\r\n  }";
styleInject(css$1);

var ArcticMapEdit$1 = function (_React$Component) {
    inherits(ArcticMapEdit, _React$Component);

    function ArcticMapEdit(props) {
        classCallCheck(this, ArcticMapEdit);

        var _this = possibleConstructorReturn(this, (ArcticMapEdit.__proto__ || Object.getPrototypeOf(ArcticMapEdit)).call(this, props));

        props.map.editor = _this;
        _this.state = {
            map: props.map,
            view: props.view,
            graphic: null,
            hideEditors: false,
            editing: false
        };
        return _this;
    }

    createClass(ArcticMapEdit, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.props.view.graphics.remove(this.state.graphic);
        }
    }, {
        key: "componentWillMount",
        value: function componentWillMount() {
            var _this2 = this;

            var self = this;
            reactArcgis.loadModules(["esri/Graphic", "esri/layers/GraphicsLayer", "esri/widgets/Sketch/SketchViewModel", "esri/geometry/Geometry"]).then(function (_ref) {
                var _ref2 = slicedToArray(_ref, 4),
                    Graphic = _ref2[0],
                    GraphicsLayer = _ref2[1],
                    SketchViewModel = _ref2[2],
                    Geometry = _ref2[3];

                var tempGraphicsLayer = new GraphicsLayer({ title: 'Edit Layer', listMode: "hide" });
                self.setState({ tempGraphicsLayer: tempGraphicsLayer });

                self.state.map.add(tempGraphicsLayer);

                var sketchViewModel = new SketchViewModel({
                    view: self.state.view,
                    layer: tempGraphicsLayer,
                    pointSymbol: {
                        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                        style: "circle",
                        color: "yellow",
                        size: "3px",
                        outline: { // autocasts as new SimpleLineSymbol()
                            color: [255, 255, 255],
                            width: 3
                        }
                    },
                    polylineSymbol: {
                        type: "simple-line", // autocasts as new SimpleLineSymbol()
                        color: "yellow",
                        width: "3",
                        style: "solid"
                    },
                    polygonSymbol: {
                        type: "simple-fill", // autocasts as new SimpleFillSymbol()
                        color: "rgba(224, 206, 69, 0.8)",
                        style: "solid",
                        outline: {
                            color: "yellow",
                            width: 3
                        }
                    }
                });

                self.setState({ tempGraphicsLayer: tempGraphicsLayer, sketchViewModel: sketchViewModel });

                self.setUpClickHandler.bind(_this2);

                sketchViewModel.on("create", function (event) {

                    if (event.state === 'complete') {
                        var graphic = new Graphic({
                            geometry: event.graphic.geometry,
                            symbol: event.graphic.symbol
                        });
                        tempGraphicsLayer.add(event.graphic);
                        if (_this2.props.single) {

                            _this2.setState({ hideEditors: true });
                        }

                        //this.geojson = event.geometry;


                        self.firenewfeature();
                        setTimeout(function () {

                            self.setState({ geojson: arcgisToGeojsonUtils.arcgisToGeoJSON(event.graphic.geometry.toJSON()), datajson: event.graphic.toJSON(), editing: false });
                        }, 1000);
                    }
                });

                sketchViewModel.on("update", function (event) {
                    self.setState({ editing: true });
                    if (event.state === 'complete' || event.state === 'cancel') {
                        // const graphic = new Graphic({
                        //     geometry: event.graphic.geometry,
                        //     symbol: event.graphic.symbol
                        // });
                        //tempGraphicsLayer.add(event.graphic);
                        // if (this.props.single) {
                        //     console.log("Added one feature");
                        //     this.setState({ hideEditors: true });
                        // }
                        self.firenewfeature();
                        setTimeout(function () {
                            self.setState({ geojson: arcgisToGeojsonUtils.arcgisToGeoJSON(event.graphics[0].geometry.toJSON()), datajson: event.graphics[0].toJSON() });
                            //this.geojson = event.geometry;
                        }, 1000);
                    }
                });

                // Listen the sketchViewModel's update-complete and update-cancel events
                sketchViewModel.on("update-complete", function (event) {
                    event.graphic.geometry = event.geometry;
                    tempGraphicsLayer.add(event.graphic);

                    // set the editGraphic to null update is complete or cancelled.
                    self.state.editGraphic = null;
                });
                // sketchViewModel.on("update-cancel", (event) => {
                //     event.graphic.geometry = event.geometry;
                //     tempGraphicsLayer.add(event.graphic);

                //     // set the editGraphic to null update is complete or cancelled.
                //     self.state.editGraphic = null;
                // });


                _this2.top_right_node = document.createElement("div");
                self.state.view.ui.add(_this2.top_right_node, "top-right");

                self.setState({ loaded: true });

                // scoped methods
                self.setEditFeature = function (feature, nofire) {
                    if (nofire === null) {
                        nofire = false;
                    }

                    if (!feature.geometry.type) {
                        feature.geometry = new Geometry(feature.geometry);
                        feature.geometry.type = "polygon";
                    }

                    _this2.state.sketchViewModel.reset();
                    _this2.state.tempGraphicsLayer.removeAll();
                    _this2.setState({ hideEditors: false, geojson: null });

                    var graphic = null;
                    if (!feature.geometry.toJSON && feature.symbol) {
                        graphic = Graphic.fromJSON(feature);
                    } else {

                        graphic = new Graphic({
                            geometry: feature.geometry,
                            symbol: _this2.state.sketchViewModel.polygonSymbol
                        });
                    }

                    if (graphic.geometry === null) {
                        graphic.geometry = feature.geometry;
                    }

                    //console.log(feature);
                    _this2.state.tempGraphicsLayer.add(graphic);
                    if (_this2.props.single) {

                        _this2.setState({ hideEditors: true });
                    }

                    self.state.view.goTo(graphic);

                    var geometry = feature.geometry;
                    if (geometry && !geometry.toJSON) {
                        geometry = Geometry.fromJSON(geometry);
                    }

                    _this2.setState({ geojson: arcgisToGeojsonUtils.arcgisToGeoJSON(geometry.toJSON()), datajson: graphic.toJSON() });

                    if (nofire === true) ; else {
                        self.firenewfeature();
                    }
                };

                self.setEditFeature = self.setEditFeature.bind(self);

                self.setGeoJson = function (geojson) {
                    //var esrijson = geojsonToArcGIS(geojson);


                };
                self.setGeoJson = self.setGeoJson.bind(self);
            }); //.catch ((err) => console.error(err));

        }
    }, {
        key: "firenewfeature",
        value: function firenewfeature() {
            var self = this;
            var evt = new Event('newfeature', { bubbles: true });
            Object.defineProperty(evt, 'target', { value: this, enumerable: true });
            evt.data = self.state.datajson;

            if (self.props.onnewfeature) {
                self.props.onnewfeature(evt);
            }

            setTimeout(function () {
                self.setState({ editing: false });
            }, 200);
        }
    }, {
        key: "addPointClick",
        value: function addPointClick() {
            this.state.sketchViewModel.create("point", { mode: "click" });
            this.setState({ editing: true });
        }
    }, {
        key: "addLineClick",
        value: function addLineClick() {
            this.state.sketchViewModel.create("polyline", { mode: "click" });
            this.setState({ editing: true });
        }
    }, {
        key: "addPolyClick",
        value: function addPolyClick() {
            this.state.sketchViewModel.create("polygon", { mode: "click" });
            this.setState({ editing: true });
        }
    }, {
        key: "addRecClick",
        value: function addRecClick() {
            this.state.sketchViewModel.create("rectangle", { mode: "click" });
            this.setState({ editing: true });
        }
    }, {
        key: "addCircleClick",
        value: function addCircleClick() {
            this.state.sketchViewModel.create("circle", { mode: "click" });
            this.setState({ editing: true });
        }
    }, {
        key: "reset",
        value: function reset() {
            this.state.sketchViewModel.reset();
            this.state.tempGraphicsLayer.removeAll();
            this.setState({ hideEditors: false, geojson: null });
        }
    }, {
        key: "widgetRender",
        value: function widgetRender() {
            return React.createElement(
                "div",
                { id: "topbar" },
                this.state.hideEditors === false && React.createElement(
                    "span",
                    null,
                    this.props.point && React.createElement("button", { className: "action-button esri-icon-blank-map-pin", style: { padding: '6px' }, id: "pointButton", onClick: this.addPointClick.bind(this),
                        type: "button", title: "Draw point" }),
                    this.props.line && React.createElement("button", { className: "action-button esri-icon-polyline", style: { padding: '6px' }, id: "polylineButton", type: "button", onClick: this.addLineClick.bind(this),
                        title: "Draw polyline" }),
                    this.props.polygon && React.createElement("button", { className: "action-button esri-icon-polygon", style: { padding: '6px' }, id: "polygonButton", type: "button", onClick: this.addPolyClick.bind(this),
                        title: "Draw polygon" }),
                    this.props.square && React.createElement("button", { className: "action-button esri-icon-checkbox-unchecked", style: { padding: '6px' }, id: "rectangleButton", onClick: this.addRecClick.bind(this),
                        type: "button", title: "Draw rectangle" }),
                    this.props.circle && React.createElement("button", { className: "action-button esri-icon-radio-unchecked", style: { padding: '6px' }, id: "circleButton", onClick: this.addCircleClick.bind(this),
                        type: "button", title: "Draw circle" })
                ),
                React.createElement("button", { className: "action-button esri-icon-trash", style: { padding: '6px' }, id: "resetBtn", type: "button", onClick: this.reset.bind(this),
                    title: "Clear graphics" })
            );
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            if (this.top_right_node) {
                ReactDOM.render(this.widgetRender(), this.top_right_node);
            }
        }
    }, {
        key: "render",
        value: function render() {

            //return (<h2>Test</h2>);


            return React.createElement("span", null);
        }
    }, {
        key: "addGraphic",
        value: function addGraphic(event) {
            // Create a new graphic and set its geometry to
            // `create-complete` event geometry.
            // const graphic = new Graphic({
            //     geometry: event.geometry,
            //     symbol: sketchViewModel.graphic.symbol
            // });
            // tempGraphicsLayer.add(graphic);
        }
    }, {
        key: "updateGraphic",
        value: function updateGraphic(event) {
            // event.graphic is the graphic that user clicked on and its geometry
            // has not been changed. Update its geometry and add it to the layer
            // event.graphic.geometry = event.geometry;
            // tempGraphicsLayer.add(event.graphic);

            // // set the editGraphic to null update is complete or cancelled.
            // editGraphic = null;
        }
    }, {
        key: "setUpClickHandler",
        value: function setUpClickHandler() {
            var self = this;
            self.state.view.on("click", function (event) {
                self.state.view.hitTest(event).then(function (response) {
                    var results = response.results;
                    // Found a valid graphic
                    if (results.length && results[results.length - 1].graphic) {
                        // Check if we're already editing a graphic
                        if (!self.state.editGraphic) {
                            // Save a reference to the graphic we intend to update
                            self.state.editGraphic = results[results.length - 1].graphic;
                            // Remove the graphic from the GraphicsLayer
                            // Sketch will handle displaying the graphic while being updated
                            self.state.tempGraphicsLayer.remove(self.state.editGraphic);
                            self.state.sketchViewModel.update(self.state.editGraphic);
                        }
                    }
                });
            });
        }
    }, {
        key: "setActiveButton",
        value: function setActiveButton(selectedButton) {
            // focus the view to activate keyboard shortcuts for sketching
            // view.focus();
            // var elements = document.getElementsByClassName("active");
            // for (var i = 0; i < elements.length; i++) {
            //     elements[i].classList.remove("active");
            // }
            // if (selectedButton) {
            //     selectedButton.classList.add("active");
            // }
        }
    }]);
    return ArcticMapEdit;
}(React.Component);

ArcticMapEdit$1.displayName = 'ArcticMapEdit';

var ArcticMapLayer = function (_React$Component) {
    inherits(ArcticMapLayer, _React$Component);

    function ArcticMapLayer(props) {
        classCallCheck(this, ArcticMapLayer);

        var _this = possibleConstructorReturn(this, (ArcticMapLayer.__proto__ || Object.getPrototypeOf(ArcticMapLayer)).call(this, props));

        _this.state = {
            map: props.map,
            view: props.view,
            graphic: null,
            blockSelect: props.blockIdentSelect !== undefined
        };
        return _this;
    }

    createClass(ArcticMapLayer, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.view.graphics.remove(this.state.graphic);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            var self = this;
            reactArcgis.loadModules(['esri/Graphic', "esri/layers/FeatureLayer", "esri/layers/MapImageLayer", "esri/layers/ImageryLayer", "esri/layers/GeoJSONLayer", "esri/layers/GraphicsLayer", "esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/geometry/Extent", "esri/layers/GroupLayer"]).then(function (_ref) {
                var _ref2 = slicedToArray(_ref, 12),
                    Graphic = _ref2[0],
                    FeatureLayer = _ref2[1],
                    MapImageLayer = _ref2[2],
                    ImageryLayer = _ref2[3],
                    GeoJSONLayer = _ref2[4],
                    GraphicsLayer = _ref2[5],
                    IdentifyTask = _ref2[6],
                    IdentifyParameters = _ref2[7],
                    Point = _ref2[8],
                    SimpleMarkerSymbol = _ref2[9],
                    Extent = _ref2[10],
                    GroupLayer = _ref2[11];

                // Create a polygon geometry


                var children = React.Children.map(_this2.props.children, function (child) {
                    if (child.type.displayName === 'ArcticMapLayerPopup') {
                        return child;
                        // return React.cloneElement(child, {
                        //     // ref: 'editor'
                        //   })
                    }
                });

                self.layerRenderers = children;

                // this.setState({ graphic });

                if (self.props.type === "feature") {

                    var featureLayer = new FeatureLayer({
                        url: self.props.src,
                        outFields: ["*"]
                    });
                    self.layerRef = featureLayer;
                    self.state.map.add(featureLayer);
                }

                if (self.props.type === "group") {
                    var trans = 1;
                    if (self.props.transparency) {
                        trans = Number.parseFloat(self.props.transparency);
                    }
                    var srcsplit = self.props.src.split(',');

                    var maplayer = new GroupLayer({
                        //url: self.props.src,
                        opacity: trans

                    });
                    if (self.props.title) {

                        maplayer.title = self.props.title;
                    }

                    srcsplit.forEach(function (src) {
                        var glayer = new MapImageLayer({
                            url: src,
                            opacity: trans

                        });
                        maplayer.layers.add(glayer);
                    });

                    self.layerRef = maplayer;
                    self.state.map.add(maplayer);
                }

                if (self.props.type === "dynamic") {

                    var trans = 1;
                    if (self.props.transparency) {
                        trans = Number.parseFloat(self.props.transparency);
                    }

                    var maplayer = new MapImageLayer({
                        url: self.props.src,
                        opacity: trans

                    });

                    if (self.props.childsrc) ;

                    if (self.props.title) {

                        maplayer.title = self.props.title;
                    }
                    maplayer.when(function () {

                        var layerids = [];
                        maplayer.allSublayers.items.forEach(function (sublayer) {
                            layerids.push(sublayer.id);
                        });
                        layerids.reverse();

                        self.identifyTask = new IdentifyTask(self.props.src);
                        self.params = new IdentifyParameters();
                        self.params.tolerance = 3;
                        self.params.layerIds = layerids;
                        self.params.layerOption = "visible";
                        self.params.width = self.state.view.width;
                        self.params.height = self.state.view.height;
                        self.params.returnGeometry = true;
                        self.params.returnGeometry = self.state.blockSelect;

                        //  console.log(self.params);
                    });

                    self.layerRef = maplayer;
                    self.state.map.add(maplayer);
                }

                if (self.props.type === "image") {

                    var imagelayer = new ImageryLayer({
                        url: self.props.src,
                        format: "jpgpng" // server exports in either jpg or png format
                    });
                    self.layerRef = imagelayer;
                    self.state.map.add(imagelayer);
                }

                if (self.props.type === "geojson") {

                    var geojsonLayer = new GraphicsLayer({ title: 'GeoJSON Layer', listMode: "hide" });
                    // var geojsonLayer = new GeoJSONLayer({
                    //     //source: self.props.src,
                    //     //copyright: "USGS Earthquakes",
                    //     //popupTemplate: template
                    //   });
                    var dataarr = [];

                    if (_typeof(self.props.src) == 'object') {
                        if (self.props.src.features) {
                            dataarr = self.props.src.features;
                        } else {
                            dataarr = self.props.src;
                        }
                    }

                    dataarr.forEach(function (obj) {
                        var esrijson = arcgisToGeojsonUtils.geojsonToArcGIS(obj);
                        if (obj.geometry.type == "Point") {

                            var popupTemplate = {
                                title: "{Name}",
                                content: self.props.template
                            };

                            var point = new Point({
                                longitude: obj.geometry.coordinates[1],
                                latitude: obj.geometry.coordinates[0]

                            });

                            // Create a symbol for drawing the point
                            var markerSymbol = new SimpleMarkerSymbol({
                                color: [226, 119, 40],
                                outline: {
                                    color: [255, 255, 255],
                                    width: 1
                                }
                            });

                            // Create a graphic and add the geometry and symbol to it
                            var pointGraphic = new Graphic({
                                geometry: point,
                                symbol: markerSymbol,
                                attributes: obj.properties,
                                popupTemplate: popupTemplate
                                // extent : new Extent().centerAt(point)
                            });

                            // Add the graphic to the view
                            geojsonLayer.graphics.add(pointGraphic);
                        }
                    });

                    self.layerRef = geojsonLayer;
                    self.state.map.add(geojsonLayer);
                    // var imagelayer = new ImageryLayer({
                    //     url: self.props.src,
                    //     format: "jpgpng" // server exports in either jpg or png format
                    // });
                    // self.layerRef = imagelayer;
                    // self.state.map.add(imagelayer);
                }

                self.layerRef.when(function () {
                    setTimeout(function () {
                        var evt = new Event('ready', { bubbles: true });
                        Object.defineProperty(evt, 'target', { value: self, enumerable: true });

                        if (self.props.onready) {
                            self.props.onready(evt);
                        }
                    }, 500);
                });

                //this.state.view.graphics.add(graphic);
            }); //.catch ((err) => console.error(err));
        }
    }, {
        key: 'zoomto',
        value: function zoomto() {
            if (this.layerRef.graphics) {
                this.state.view.goTo(this.layerRef.graphics.items);
            }
        }
    }, {
        key: 'renderPopup',
        value: function renderPopup(feature, result) {

            if (result.layerId != undefined && this.layerRenderers) {
                var popuprender = this.layerRenderers.find(function (l) {
                    return l.props.layerid === result.layerId.toString();
                });

                if (popuprender && popuprender.props.popup != undefined) {
                    var ele = popuprender.props.popup(feature, result);

                    if (ele) {
                        var workingdiv = document.createElement('div');
                        var html = ReactDOM.render(ele, workingdiv);
                        return workingdiv;
                    }
                }
            }

            var popupText = "";
            var atts = Object.getOwnPropertyNames(feature.attributes);
            atts.forEach(function (att) {
                popupText += '<b>' + att + '</b> : ' + feature.attributes[att] + '<br/>';
            });

            return popupText;
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }, {
        key: 'identify',
        value: function identify(event, callback) {

            if (!this.params) {
                callback(null);return;
            }

            this.params.geometry = event.mapPoint;
            this.params.mapExtent = this.state.view.extent;
            //document.getElementById("viewDiv").style.cursor = "wait";
            this.identifyTask.execute(this.params).then(function (response) {

                callback(response);
            });
        }
    }]);
    return ArcticMapLayer;
}(React.Component);

ArcticMapLayer.displayName = "ArcticMapLayer";

var css$2 = ".ArcticMapLLDSearch_lldsearchbar__1eLzA {\r\n    background: #fff;\r\n\r\n    vertical-align: top; \r\n  }\r\n\r\n\r\n  .ArcticMapLLDSearch_lldsearchbar__1eLzA div{\r\n    display: inline;\r\n  }";
var style = { "lldsearchbar": "ArcticMapLLDSearch_lldsearchbar__1eLzA" };
styleInject(css$2);

// WY060140N0660W0SN180ANENE

var ArcticMapLLDSearch = function (_React$Component) {
    inherits(ArcticMapLLDSearch, _React$Component);

    function ArcticMapLLDSearch(props) {
        classCallCheck(this, ArcticMapLLDSearch);

        var _this = possibleConstructorReturn(this, (ArcticMapLLDSearch.__proto__ || Object.getPrototypeOf(ArcticMapLLDSearch)).call(this, props));

        _this.state = {
            map: props.map,
            view: props.view,
            graphic: null
        };

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    createClass(ArcticMapLLDSearch, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var self = this;
            reactArcgis.loadModules(['esri/Graphic', "esri/layers/FeatureLayer", "esri/layers/MapImageLayer", "esri/layers/ImageryLayer", "esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters", 'esri/geometry/Geometry', 'esri/geometry/Polygon', "esri/widgets/Search/SearchSource", "esri/request", "esri/geometry/geometryEngine", "esri/geometry/Point"]).then(function (_ref) {
                var _ref2 = slicedToArray(_ref, 12),
                    Graphic = _ref2[0],
                    FeatureLayer = _ref2[1],
                    MapImageLayer = _ref2[2],
                    ImageryLayer = _ref2[3],
                    IdentifyTask = _ref2[4],
                    IdentifyParameters = _ref2[5],
                    Geometry = _ref2[6],
                    Polygon = _ref2[7],
                    SearchSource = _ref2[8],
                    esriRequest = _ref2[9],
                    geometryEngine = _ref2[10],
                    Point = _ref2[11];

                //var elestring = this.createElementFromHTML( `<input type="text" placeholder="Find address or place" aria-label="Search" autocomplete="off" tabindex="0" class="esri-input esri-search__input" aria-autocomplete="list" aria-haspopup="true" aria-owns="1687b00a338-widget-1-suggest-menu" role="textbox" data-node-ref="_inputNode" title="Find address or place">`);

                self.top_right_node = document.createElement("div");

                self.Graphic = Graphic;
                self.Geometry = Geometry;
                self.Polygon = Polygon;

                self.state.view.ui.add(self.top_right_node, {
                    position: "top-right",
                    index: 0
                });

                self.search = function () {
                    return new SearchSource({
                        name: 'Legal Land Description',
                        placeholder: "example: NV 21 T38N R56E SEC 10 ALIQ SESW",

                        getSuggestions: function getSuggestions(params) {

                            return fetch("https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD?legaldescription=" + params.suggestTerm.replace(/ /g, "+") + "+&returnalllevels=&f=json").then(function (r) {
                                return r.json();
                            }).then(function (data) {

                                return data.features.map(function (feature) {
                                    return {
                                        key: "name",
                                        text: feature.attributes.landdescription,
                                        sourceIndex: params.sourceIndex
                                    };
                                });
                            });
                        },

                        getResults: function getResults(params) {

                            return fetch("https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD?legaldescription=" + params.suggestResult.text.replace(/ /g, "+") + "+&returnalllevels=&f=json").then(function (r) {
                                return r.json();
                            }).then(function (data) {
                                console.log(data);
                                return data.features.map(function (feature) {

                                    var outfeature = Graphic.fromJSON(feature);

                                    return {
                                        key: "name",
                                        text: feature.attributes.landdescription,
                                        sourceIndex: params.sourceIndex,
                                        feature: outfeature,

                                        name: feature.attributes.landdescription
                                    };
                                });
                            });
                        }
                    });
                };
            });
        }
    }, {
        key: "searchLLD",
        value: function searchLLD(event) {
            console.log(this.state.searchinput);
            var self = this;

            fetch("https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD?legaldescription=" + this.state.searchinput + "+&returnalllevels=&f=json").then(function (r) {
                return r.json();
            }).then(function (data) {
                console.log(data);

                var popupresults = data.features.map(function (feature) {

                    feature.geometry = self.Polygon.fromJSON(feature.geometry);

                    feature = new self.Graphic(feature);

                    var displayValue = feature.attributes.landdescription;

                    feature.popupTemplate = { // autocasts as new PopupTemplate()
                        title: 'Legal Land Description',
                        content: "<b>LLD</b>: " + displayValue,
                        actions: [{ title: "Select", id: "select-action" }]
                    };

                    return feature;
                });

                if (popupresults.length > 0) {
                    self.state.view.popup.open({
                        features: popupresults,
                        location: event.mapPoint
                    });
                }
            });
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({ searchinput: event.target.value });
        }
    }, {
        key: "widgetRender",
        value: function widgetRender() {
            return React.createElement(
                "div",
                { className: style.lldsearchbar },
                React.createElement(
                    "div",
                    { style: { display: 'inline-block', height: '32px', marginTop: '0px' } },
                    React.createElement("input", { style: { display: 'inline-block', height: '32px', verticalAlign: 'top' }, value: this.state.searchinput, onChange: this.handleChange, type: "text", placeholder: "Find legal land description", "aria-label": "Search", className: "esri-input", title: "Find leagal land desription" }),
                    React.createElement(
                        "div",
                        { style: { display: 'inline-block', width: '32px', height: '32px', verticalAlign: 'top' }, role: "button", title: "Search", className: "esri-search__submit-button esri-widget--button", onClick: this.searchLLD.bind(this) },
                        React.createElement("span", { style: { display: 'block', paddingTop: '8px' }, "aria-hidden": "true", role: "presentation", className: "esri-icon-search" })
                    )
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            return null;
        }
    }]);
    return ArcticMapLLDSearch;
}(React.Component);

ArcticMapLLDSearch.displayName = 'ArcticMapLLDSearch';

var ArcticMapLayerPopup = function (_React$Component) {
    inherits(ArcticMapLayerPopup, _React$Component);

    function ArcticMapLayerPopup(props) {
        classCallCheck(this, ArcticMapLayerPopup);
        return possibleConstructorReturn(this, (ArcticMapLayerPopup.__proto__ || Object.getPrototypeOf(ArcticMapLayerPopup)).call(this, props));
    }

    createClass(ArcticMapLayerPopup, [{
        key: 'render',
        value: function render() {

            return React.createElement('span', null);
        }
    }, {
        key: 'renderPopup',
        value: function renderPopup(context) {
            if (this.props.popup) {
                return this.props.popup(context);
            }
        }
    }]);
    return ArcticMapLayerPopup;
}(React.Component);

ArcticMapLayerPopup.displayName = 'ArcticMapLayerPopup';

var ArcticMapControlArea = function (_React$Component) {
    inherits(ArcticMapControlArea, _React$Component);

    function ArcticMapControlArea(props) {
        classCallCheck(this, ArcticMapControlArea);

        var _this = possibleConstructorReturn(this, (ArcticMapControlArea.__proto__ || Object.getPrototypeOf(ArcticMapControlArea)).call(this, props));

        _this.controlNode = document.createElement("div");
        _this.props.view.ui.add(_this.controlNode, _this.props.location);
        return _this;
    }

    createClass(ArcticMapControlArea, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.controlNode) {
                ReactDOM.render(this.widgetRender(), this.controlNode);
            }
        }
    }, {
        key: 'widgetRender',
        value: function widgetRender() {
            return React.createElement(
                'span',
                { className: 'arcticmap-area' },
                this.props.children
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('span', null);
        }
    }]);
    return ArcticMapControlArea;
}(React.Component);

ArcticMapControlArea.displayName = 'ArcticMapControlArea';

var style$1 = {
    arcticButton: {
        padding: "5px",
        height: "32px",
        width: "32px",
        backgroundColor: "#fff",
        color: '#6e6e6e',
        border: 'none',
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            backgroundColor: "#ccc"
        }
    }
};

var ArcticMapButton = function (_React$Component) {
    inherits(ArcticMapButton, _React$Component);

    function ArcticMapButton(props) {
        classCallCheck(this, ArcticMapButton);

        var _this = possibleConstructorReturn(this, (ArcticMapButton.__proto__ || Object.getPrototypeOf(ArcticMapButton)).call(this, props));

        _this.state = {
            enabled: true,
            useEsriIcon: props.esriicon !== null
        };

        _this.fireclick = function (e) {
            if (this.props.onclick) {
                this.props.onclick(e);
            }
        };

        return _this;
    }

    createClass(ArcticMapButton, [{
        key: "render",
        value: function render() {
            if (this.state.useEsriIcon) {

                var esriClassName = 'esri-icon esri-icon-' + this.props.esriicon;

                return React.createElement(
                    "button",
                    { style: style$1.arcticButton, onClick: this.fireclick.bind(this) },
                    React.createElement("span", { style: { height: "15px", width: "15px" }, "aria-hidden": true, className: esriClassName })
                );
            } else {
                return React.createElement("div", null);
            }
        }
    }]);
    return ArcticMapButton;
}(React.Component);

ArcticMapButton.displayName = 'ArcticMapButton';

var styles = {
    rightWidgetFull: {
        "position": "absolute",
        "right": "2px",
        "top": "2px",
        "bottom": "2px",
        "zIndex": "100",

        "minWidth": '30%',
        paddingTop: '30px'
    },
    widgetContainer: {
        position: 'realative',
        "paddingRight": "18px",
        "paddingLeft": "18px",
        "overflowY": 'scroll',
        "maxHeight": '100%'
    }

};

var ArcticMapPanel = function (_React$Component) {
    inherits(ArcticMapPanel, _React$Component);

    function ArcticMapPanel(props) {
        classCallCheck(this, ArcticMapPanel);

        var _this = possibleConstructorReturn(this, (ArcticMapPanel.__proto__ || Object.getPrototypeOf(ArcticMapPanel)).call(this, props));

        _this.toggle = function () {
            console.log('Toggle Panel');
            var currvalue = this.state.open;
            this.setState({ open: !currvalue });
        };

        _this.mapFrame = document.getElementsByClassName('esri-view-root')[0];
        _this.renderEle = document.createElement("span");
        _this.mapFrame.appendChild(_this.renderEle);
        _this.state = {
            open: _this.props.open || false
        };

        return _this;
    }

    createClass(ArcticMapPanel, [{
        key: 'render',
        value: function render() {
            this.renderPanel();
            return React.createElement(
                'span',
                null,
                React.createElement(ArcticMapButton, { esriicon: this.props.esriicon, onclick: this.toggle.bind(this) })
            );
        }
    }, {
        key: 'renderPanel',
        value: function renderPanel() {
            // refactor this
            if (this.state.open) {
                var ele = React.createElement('div', { className: 'esri-widget', style: styles.rightWidgetFull }, React.createElement('h2', { style: { marginTop: '6px', position: 'absolute', left: '8px', top: '0' } }, this.props.title), React.createElement('span', { style: { position: 'absolute', top: '0', right: '0' } }, React.createElement(ArcticMapButton, { esriicon: 'close', onclick: this.toggle.bind(this) })), React.createElement('div', { style: styles.widgetContainer }, React.createElement('div', null, this.props.children)));

                ReactDOM.render(ele, this.renderEle);
            } else {
                var ele = React.createElement('span', null);
                ReactDOM.render(ele, this.renderEle);
            }
        }
    }]);
    return ArcticMapPanel;
}(React.Component);

ArcticMapPanel.displayName = 'ArcticMapPanel';

exports.ArcticMap = ArcticMap$1;
exports.ArcticMapEdit = ArcticMapEdit$1;
exports.ArcticMapLayer = ArcticMapLayer;
exports.ArcticMapLLDSearch = ArcticMapLLDSearch;
exports.ArcticMapLayerPopup = ArcticMapLayerPopup;
exports.ArcticMapControlArea = ArcticMapControlArea;
exports.ArcticMapButton = ArcticMapButton;
exports.ArcticMapPanel = ArcticMapPanel;
//# sourceMappingURL=ArcticMap.js.map
