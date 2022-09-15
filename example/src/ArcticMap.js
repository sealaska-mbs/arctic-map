'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var async = require('async');
var async__default = _interopDefault(async);
var ReactDOM = _interopDefault(require('react-dom'));
var reactArcgis = require('react-arcgis');
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

var css = ".ArcticMap_simple-form-group__3yxCc {\r\n    margin-bottom: 1rem;\r\n  }\r\n  .ArcticMap_simple-text-label__JFxOr {\r\n    display: block;\r\n    color: red;\r\n  }\r\n  .ArcticMap_simple-text-input__2Da66 {\r\n    display: inline-block;\r\n    margin-bottom: 0.5rem;\r\n    font-size: 16px;\r\n    font-weight: 400;\r\n    color: rgb(33, 37, 41);\r\n  }\r\n\r\n#ArcticMap_bottomleftbar__1Odoz{\r\n  background: #fff;\r\n  position: absolute;\r\n  bottom: 30px;\r\n  left: 15px;\r\n  padding: 0px;\r\n  font-family: 'Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif'\r\n}\r\n\r\n#ArcticMap_bottomleftbar__1Odoz p{\r\n  padding-left: 12px;\r\n  padding-right: 12px;\r\n}\r\n  \r\n#ArcticMap_bottombar__qE1e6 {\r\n    background: #fff;\r\n    position: absolute;\r\n    bottom: 30px;\r\n    right: 15px;\r\n    padding: 0;\r\n  }\r\n\r\n  .ArcticMap_action-button__MaMS6 {\r\n    font-size: 16px;\r\n    background-color: transparent;\r\n    border: 1px solid #D3D3D3;\r\n    color: #6e6e6e;\r\n    height: 32px;\r\n    width: 32px;\r\n    text-align: center;\r\n    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);\r\n  }\r\n\r\n  .ArcticMap_action-button__MaMS6:hover,\r\n  .ArcticMap_action-button__MaMS6:focus {\r\n    background: #0079c1;\r\n    color: #e4e4e4;\r\n  }\r\n\r\n  .ArcticMap_active__1K4ZI {\r\n    background: #0079c1;\r\n    color: #e4e4e4;\r\n  }\r\n\r\n  .ArcticMap_arctic-map-hidden__Azy1_ {\r\n    display: none !important;\r\n  }";
var styles = { "simple-form-group": "ArcticMap_simple-form-group__3yxCc", "simple-text-label": "ArcticMap_simple-text-label__JFxOr", "simple-text-input": "ArcticMap_simple-text-input__2Da66", "bottomleftbar": "ArcticMap_bottomleftbar__1Odoz", "bottombar": "ArcticMap_bottombar__qE1e6", "action-button": "ArcticMap_action-button__MaMS6", "active": "ArcticMap_active__1K4ZI", "arctic-map-hidden": "ArcticMap_arctic-map-hidden__Azy1_" };
styleInject(css);

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

var ArcticMapButton = function (_React$Component) {
    inherits(ArcticMapButton, _React$Component);

    function ArcticMapButton(props) {
        classCallCheck(this, ArcticMapButton);

        var _this = possibleConstructorReturn(this, (ArcticMapButton.__proto__ || Object.getPrototypeOf(ArcticMapButton)).call(this, props));

        _this.state = {
            enabled: true,
            useEsriIcon: props.esriicon !== null,
            active: props.showactive !== undefined && props.showactive === true

        };

        _this.fireclick = function (e) {
            if (this.props.onclick) {
                this.props.onclick(e);
            }
        };

        return _this;
    }

    createClass(ArcticMapButton, [{
        key: 'render',
        value: function render() {

            var style = {
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
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: "#ccc"
                    }
                }
            };

            if (this.props.padtop) {
                style.arcticButton.marginTop = '10px';
            }
            if (this.props.padbottom) {
                style.arcticButton.marginBOttom = '10px';
            }

            if (this.state.useEsriIcon) {
                if (this.props.showactive && this.props.showactive === true) {
                    style.arcticButton.backgroundColor = "#d4d1d1";
                } else {
                    style.arcticButton.backgroundColor = "#fff";
                }

                var esriClassName = 'esri-icon esri-icon-' + this.props.esriicon;

                return React.createElement(
                    'button',
                    { style: style.arcticButton, onClick: this.fireclick.bind(this), title: this.props.title },
                    React.createElement('span', { style: { height: "15px", width: "15px" }, 'aria-hidden': true, className: esriClassName })
                );
            } else {
                return React.createElement('div', null);
            }
        }
    }]);
    return ArcticMapButton;
}(React.Component);

ArcticMapButton.displayName = 'ArcticMapButton';

var style = {
    bg: {
        zIndex: "100",
        position: "absolute",
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#5856569e'

    }

};
var loadingtext = {
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white'
};

var ArcticMapLoader = function (_React$Component) {
    inherits(ArcticMapLoader, _React$Component);

    function ArcticMapLoader(props) {
        classCallCheck(this, ArcticMapLoader);
        return possibleConstructorReturn(this, (ArcticMapLoader.__proto__ || Object.getPrototypeOf(ArcticMapLoader)).call(this, props));
    }

    createClass(ArcticMapLoader, [{
        key: 'render',
        value: function render() {

            if (this.props.loading === true) {

                return React.createElement(
                    'div',
                    { style: style.bg },
                    React.createElement(
                        'h1',
                        { style: loadingtext },
                        'Working...'
                    )
                );
            }
            return null;
        }
    }]);
    return ArcticMapLoader;
}(React.Component);

ArcticMapLoader.displayName = 'ArcticMapLoader';

var styles$1 = {
    rightWidgetFull: {
        "position": "absolute",
        "right": "2px",
        "top": "2px",
        "bottom": "2px",
        "zIndex": "100",

        "minWidth": '30%',
        "paddingTop": '20px'
    },
    widgetContainer: {
        "position": 'realative',
        "paddingRight": "20px",
        "paddingLeft": "20px",
        "paddingBottom": "50px",

        "overflowY": 'auto',
        "maxHeight": '100%'
    }

};

var ArcticMapPanel = function (_React$Component) {
    inherits(ArcticMapPanel, _React$Component);

    function ArcticMapPanel(props) {
        classCallCheck(this, ArcticMapPanel);

        var _this = possibleConstructorReturn(this, (ArcticMapPanel.__proto__ || Object.getPrototypeOf(ArcticMapPanel)).call(this, props));

        _this.toggle = function () {

            var currvalue = this.state.open;
            this.setState({ open: !currvalue });

            if (this.props.ontoggle) {
                this.props.ontoggle();
            }
        };
        _this.toggle = _this.toggle.bind(_this);

        _this.mapFrame = document.getElementsByClassName('esri-view-root')[0];
        _this.renderEle = document.createElement("span");
        _this.mapFrame.appendChild(_this.renderEle);
        _this.state = {
            hidden: !_this.props.hidden ? false : true,
            open: _this.props.open || false
        };

        ArcticMapPanel.defaultProps = {
            infoAreaText: {}
        };

        if (props.map) {
            _this.map = props.map;
        }
        if (props.view) {
            _this.view = props.view;
            _this.view.on('click', function (e) {
                _this.setState({ open: false });
            });
        }
        return _this;
    }

    createClass(ArcticMapPanel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {

            // console.log(self.props);
            // self.props.view.on('click', (event) => {

            //     self.setState({ open: false });

            // });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.renderPanel();
        }
    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'span',
                { visibility: this.state.hidden },
                React.createElement(ArcticMapButton, { padtop: this.props.padtop, padbottom: this.props.padbottom, esriicon: this.props.esriicon, onclick: this.toggle.bind(this), title: this.props.title })
            );
        }

        // renderInfoArea() {
        //     return (
        //         <div>{this.props.infoAreaText}</div>
        //     )
        // }

    }, {
        key: 'renderPanel',
        value: function renderPanel() {
            // refactor this
            if (this.state.open) {
                var ele = React.createElement('div', { className: 'esri-widget', style: styles$1.rightWidgetFull }, React.createElement('h2', { style: { "paddingLeft": "20px", marginTop: '6px', fontSize: '28px', marginBottom: '10px' } }, this.props.title), React.createElement('div', { style: { position: 'absolute', top: '20px', right: '20px' } }, React.createElement('button', {
                    onClick: this.toggle,
                    title: 'Close',
                    style: { border: 'none', background: 'transparent', cursor: 'pointer' }
                }, React.createElement('span', {
                    style: { fontSize: '28px' },
                    'aria-hidden': true,
                    className: 'esri-icon esri-icon-close'
                }))
                //React.createElement(ArcticMapButton, { esriicon: 'close', onclick: this.toggle, style : { fontSize : '28px'} })
                ), React.createElement('p', { style: { width: "300px", paddingLeft: "20px", wordWrap: "break-word", margin: "0px", whiteSpace: "pre-line" } }, this.props.infoAreaText
                // this.renderInfoArea()
                ), React.createElement('div', { style: styles$1.widgetContainer }, React.createElement('div', null, this.props.children)));

                // <button style={style.arcticButton} onClick={this.fireclick.bind(this)} title={this.props.title} >
                //     <span style={{ height: "15px", width: "15px" }} aria-hidden className={esriClassName} ></span>
                // </button>

                ReactDOM.render(ele, this.renderEle);
            } else {
                var eleempty = React.createElement('span', null);
                ReactDOM.render(eleempty, this.renderEle);
            }
        }
    }]);
    return ArcticMapPanel;
}(React.Component);

ArcticMapPanel.displayName = 'ArcticMapPanel';

var style$1 = document.createElement('style');
style$1.id = "esri-overrides";
style$1.innerHTML = '.esri-ui-bottom-right {' + 'flex-flow: column;' + '}' + '.esri-ui-bottom-right .esri-component {' + 'margin-top: 10px;' + '}' + '.esri-layer-list { background-color: transparent; padding: 1px; }' + '.esri-layer-list__item--has-children .esri-layer-list__item { box-shadow: none; }' + '.esri-layer-list__item--has-children { border-bottom: none; box-shadow: 0px 0px 3px 0px black; border-radius: 4px; margin-bottom: 10px;  }' + '.esri-basemap-gallery { position: absolute; bottom: 0; right: 0; }';
document.head.appendChild(style$1);

var ArcticMap = function (_React$Component) {
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
      mode: props.mode || "view",
      basemap: props.basemap || "hybrid",
      sr: Number.parseInt(props.sr || "102100")
    };

    _this.handleMapLoad = _this.handleMapLoad.bind(_this);
    _this.handleMapClick = _this.handleMapClick.bind(_this);
    _this.layers = [];
    return _this;
  }

  createClass(ArcticMap, [{
    key: 'render',
    value: function render() {
      var self = this;
      var index = 0;
      this.layers = [];
      self.childrenElements = [];

      var children = React.Children.map(this.props.children, function (child) {
        //console.log(child);
        if (child) {
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
              am: self
              // ref: 'editor'

            });
          }

          // else if (child.type.name === 'ArcticMapLLDSearch') {

          //   return React.cloneElement(child, {
          //   })

          // } 

          else {
              return React.cloneElement(child, {
                am: self,

                map: self.state.map,
                view: self.state.view,
                //ref: 'child-' + (index++)
                ref: function ref(c) {
                  if (c) {
                    self.childrenElements.push(c);
                  }return 'child-' + index++;
                }
              });
            }
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
        React.createElement(ArcticMapLoader, { loading: this.state.loading })
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
    key: 'setEdit',
    value: function setEdit(json, nofire, type) {
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
  }, {
    key: 'setMode',
    value: function setMode(val) {
      this.setState({ mode: val });
      if (val === "identify") {
        this.state.view.cursor = "help";
      }
      if (val === "view") {
        this.state.view.cursor = "grab";
      }
      if (val === "select") {
        this.state.view.cursor = "auto";
      }
      if (val === "edit") {
        this.state.view.cursor = "crosshairs";
      }
    }
  }, {
    key: 'setJson',
    value: function setJson(json) {
      if (this.state.map.editor) {
        this.state.map.editor.setEditFeature(json, true);
      }
    }
  }, {
    key: 'drawTempGraphic',
    value: function drawTempGraphic(view, event) {
      view.graphics.removeAll();
      //w.toMap({ x: event.x, y: event.y });
      var pt1 = view.toMap({ x: event.origin.x, y: event.origin.y });
      var pt2 = view.toMap({ x: event.x, y: event.y });
      var rings = [[pt1.x, pt1.y], [pt1.x, pt2.y], [pt2.x, pt2.y], [pt2.x, pt1.y]];
      reactArcgis.loadModules(['esri/geometry/Polygon', 'esri/Graphic']).then(function (_ref) {
        var _ref2 = slicedToArray(_ref, 2),
            Polygon = _ref2[0],
            Graphic = _ref2[1];

        var tempPolygon = new Polygon({
          hasz: false,
          hasm: false,
          rings: rings,
          spatialReference: view.spatialReference
        });
        var tempSymbol = {
          type: "simple-line", // autocasts as new SimpleLineSymbol()
          color: [128, 128, 128],
          width: "5px",
          style: "solid"
        };
        var tempPolygonGraphic = new Graphic({
          geometry: tempPolygon,
          symbol: tempSymbol
        });
        view.graphics.add(tempPolygonGraphic);

        if (event.action === "end") {
          view.graphics.removeAll();
        }
      });
    }
  }, {
    key: 'handleMapLoad',
    value: function handleMapLoad(map, view) {
      var _this2 = this;

      this.setState({ map: map, view: view });

      var self = this;
      self.state.map.amlayers = [];
      var centerSplit = this.props.center.split('|');
      view.center = [parseFloat(centerSplit[1]), parseFloat(centerSplit[0])];
      view.zoom = parseInt(centerSplit[2]);
      self.cntrlIsPressed = false;

      reactArcgis.loadModules(['esri/widgets/Locate', 'esri/widgets/BasemapGallery', 'esri/widgets/Home', 'esri/widgets/Search', 'esri/layers/FeatureLayer',
      // 'esri/tasks/Locator',
      'esri/geometry/geometryEngine', 'esri/tasks/support/IdentifyParameters', 'esri/request', 'esri/geometry/Polygon']).then(function (_ref3) {
        var _ref4 = slicedToArray(_ref3, 9),
            Locate = _ref4[0],
            BasemapGallery = _ref4[1],
            Home = _ref4[2],
            Search = _ref4[3],
            FeatureLayer = _ref4[4],

        // Locator,
        geometryEngine = _ref4[5],
            IdentifyParameters = _ref4[6],
            Request = _ref4[7],
            Polygon = _ref4[8];

        window._request = Request;
        window._map = self;
        self.request = Request;

        if (self.state.mode === "identify") {
          self.state.view.cursor = "help";
        }
        if (self.state.mode === "view") {
          self.state.view.cursor = "grab";
        }
        if (self.state.mode === "edit") {
          self.state.view.cursor = "crosshairs";
        }

        if (self.state.mode === "select") {
          self.state.view.cursor = "auto";
        }

        //   self.state.view.spatialReference = {
        //     wkid: self.state.sr,
        //  };

        // var layerList = new LayerList({
        //   view: self.state.view,
        //   listItemCreatedFunction: function (event) {
        //     const item = event.item
        //     item.panel = {
        //       content: 'legend',
        //       open: false
        //     }
        //   }
        // })


        view.popup.dockEnabled = true;
        view.popup.dockOptions.position = 'bottom-left';
        //var layers = React.Children.toArray(this.props.children).filter((ele) => ele.type.name === "ArcticMapLayer");


        // console.log(layers);
        view.popup.watch("visible", function (visible) {

          if (!visible) {
            view.graphics.removeAll();
          }
        });

        view.popup.watch('selectedFeature', function (graphic) {
          view.graphics.removeAll();
          if (graphic) {
            var graphicTemplate = graphic.getEffectivePopupTemplate();
            if (graphic.geometry) {
              graphicTemplate.actions = [{
                id: 'select-item',
                title: 'Select',
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTQyREM3RDkwQzVGMTFFNTk4QkI4OTBEOTYzQTg5MzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTQyREM3REEwQzVGMTFFNTk4QkI4OTBEOTYzQTg5MzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NDJEQzdENzBDNUYxMUU1OThCQjg5MEQ5NjNBODkzMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NDJEQzdEODBDNUYxMUU1OThCQjg5MEQ5NjNBODkzMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Prb3PqgAAACTSURBVHjaYvz//z8DJYCJgVJAjgsiIyMFQBjEZgQZwMjISJJmILUXynVmIdVmqGZ9qFAe0S7AonnR8uXLk5jItBmsGSUWgIriSdUMNwCoaB6QmgulidaM7AKYgjiYIcRohkdjVFQUhmIoG69mlHSAxUYGQppRAhGo6AMoYQDxRWI1Y02JSC65SEgz3IABzY0AAQYAhIhWWCl3Pj0AAAAASUVORK5CYII="
              }];
              graphicTemplate.actions.items[0].visible = self.state.map.editor !== undefined; // graphic.attributes.website ? true : false;
            } else {
              graphicTemplate.actions = [];
            }
            reactArcgis.loadModules(['esri/symbols/SimpleFillSymbol']).then(function (_ref5) {
              var _ref6 = slicedToArray(_ref5, 1),
                  SimpleFillSymbol = _ref6[0];

              var symbol = new SimpleFillSymbol({
                color: [135, 206, 235, 0.5],
                style: "solid",
                outline: {
                  color: [0, 191, 255],
                  width: 1
                }
              });
              if (graphic) {
                graphic.symbol = symbol;
                var popupGraphic = graphic;
                view.graphics.add(popupGraphic);
              } else {
                view.graphics.removeAll();
                view.popup.content.graphic = null;
              }
            });
            //self.state.view.goTo(graphic);
          }
        });
        view.popup.viewModel.on('trigger-action', function (event) {
          //var target = event.target || window.event.target || window.event.srcElement;
          if (event.action.id === 'select-item') {
            self.state.map.editor.setEditFeature(view.popup.selectedFeature, null, null, false, true);
            view.popup.close();
          }
        });

        window.addEventListener("keydown", function (event) {
          if (event.which == "17") self.cntrlIsPressed = true;
        });

        window.addEventListener("contextmenu", function (event) {
          self.contextmenuPressed = true;
        });

        window.addEventListener("keyup", function (event) {
          self.cntrlIsPressed = false;
        });

        view.on('drag', function (event) {

          console.log("drag", self);

          if (self.state.mode === "review") {
            self.drawTempGraphic(self.state.view, event);
            event.stopPropagation();
            var vw = self.state.view;
            var pt = vw.toMap({ x: event.x, y: event.y });
            var idParams = new IdentifyParameters();
            if (event.action === "start") {
              self.dragStart = pt;
            }
            if (event.action == "end") {
              var rings = [[pt.x, pt.y], [pt.x, self.dragStart.y], [self.dragStart.x, self.dragStart.y], [self.dragStart.x, pt.y]];
              var tempPolygon = new Polygon({
                hasz: false,
                hasm: false,
                rings: rings,
                spatialReference: self.state.view.spatialReference
              });
              //console.log("check self", self);
              idParams.geometry = tempPolygon;
              idParams.tolerance = 3;
              //vw.goTo([pt,self.dragStart]);
              self.layers.filter(function (layer) {
                //console.log("layers", layer);
                layer.params.width = self.state.view.width;
                layer.params.height = self.state.view.height;
                layer.params.mapExtent = self.state.view.extent;
                layer.params.geometry = tempPolygon;
                layer.identifyTask.execute(layer.params).then(function (response) {
                  //console.log("identifyTask ",response );

                });
              });
            }

            // self.layer.identifyArea(self.dragStart, pt, self.layer.props.allowMultiSelect, function (results) {
            //   console.log("identifyArea", results);
            //   if (results) {
            //     results.layer = self.layer;
            //     identresults.push(results);
            //   }

            // });
          }
          if (self.state.mode === "select") {

            self.drawTempGraphic(self.state.view, event);
            event.stopPropagation();
            var vw = self.state.view;
            var pt = vw.toMap({ x: event.x, y: event.y });

            if (event.action === "start") {
              self.dragStart = pt;
            } else if (event.action === "end") {
              if (event.button == 0) {
                self.contextmenuPressed = false;
              }
              if (self.state.map.editor && self.state.map.editor.state.editing === true) {
                return;
              }

              var identresults = [];
              self.setState({ loading: true });

              var identLayers = self.layers.filter(function (layer) {
                //TODO check if this is selectable
                if (layer.props.allowMultiSelect === undefined) {
                  return;
                }

                var mapzoom = view.zoom;

                if (layer.props.identMaxZoom !== undefined) {
                  if (Number.parseInt(layer.props.identMaxZoom, 10) > mapzoom) {
                    return layer;
                  } else {
                    return;
                  }
                }

                return layer;
              });

              identLayers = identLayers.concat(self.state.map.amlayers);

              async__default.eachSeries(identLayers, function (layer, cb) {
                if (!layer.state.disablePopup) {
                  //TODO
                  layer.identifyArea(self.dragStart, pt, layer.props.allowMultiSelect, function (results) {
                    if (results) {
                      results.layer = layer;
                      identresults.push(results);
                    }
                    cb();
                  });
                }
              }, function (err) {
                var results = identresults.map(function (ir) {
                  ir.results.forEach(function (res) {
                    res.layer = ir.layer;
                  });
                  return ir.results;
                }) || [].reduce(function (a, b) {
                  return a.concat(b);
                });

                self.setState({ loading: false });

                results = results.flat();

                var feature = null;
                for (var idx = 0; idx < results.length; idx++) {
                  feature = results[idx].feature;

                  self.state.map.editor.setEditFeature(feature, null, null, false, true, self.contextmenuPressed);
                }
              });
            }
          } else if (event.button != 0) {
            self.drawTempGraphic(self.state.view, event);
            event.stopPropagation();
            var vw = self.state.view;
            var pt = vw.toMap({ x: event.x, y: event.y });
            //console.log("self.", self);
            //console.log("self.dragStart", self.dragStart);
            if (event.action === "start") {
              self.dragStart = pt;
            } else if (event.action === "end") {
              vw.goTo([pt, self.dragStart]);
            }
          }
        });

        view.on('click', function (event) {
          if (event.button == 0) {
            self.contextmenuPressed = false;
          }

          //console.log(event);

          //hide stuff


          if (self.state.hideBasemapButton && self.state.hideBasemapButton === true) {
            self.state.view.ui.remove(self.basemapGallery);
            self.setState({ hideBasemapButton: false });
            return;
          }

          if (self.state.mode === "view") {
            return;
          }

          if (event.button == 0) {
            if (self.state.map.editor && self.state.map.editor.state.editing === true) {
              return;
            }
          }

          var currentmode = self.state.mode;
          if (currentmode !== 'select') {
            self.setMode("view");
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
              } else {
                return;
              }
            }

            return layer;
          });

          identLayers = identLayers.concat(self.state.map.amlayers);

          async__default.eachSeries(identLayers, function (layer, cb) {
            if (layer.layerRef.visible === false || layer.layerRef.sublayers === undefined && layer.props.type !== "geojson" && layer.props.type !== "group" && layer.props.type !== "feature") {
              cb();
              return;
            }
            if (!layer.state.disablePopup && layer.layerRef.visible === true && (layer.layerRef.sublayers !== undefined || layer.props.type === "feature") || layer.props.type === "geojson" || layer.props.type === "group") {
              var visibleLayers = [];
              var noFilter = false;
              if (layer.props.sublayers) {
                layer.props.sublayers.forEach(function (s) {
                  if (s.nofilter === true) {
                    noFilter = s.nofilter;
                  }
                });
              }

              var isLayerVisible = function isLayerVisible(lyr) {
                var isVisible = lyr.visible;
                if (lyr.visible && lyr.parent && lyr.parent.title && lyr.parent.url) {
                  isVisible = isLayerVisible(lyr.parent);
                }
                return isVisible;
              };

              if (layer.layerRef.sublayers) {
                layer.layerRef.allSublayers.forEach(function (sub) {
                  if (!sub.sublayers && isLayerVisible(sub) && noFilter === false) {
                    visibleLayers.push(sub.url);
                  }
                });
              }

              layer.identify(event, function (results) {
                if (results) {
                  results.layer = layer;

                  if (visibleLayers.length > 0) {
                    var rem = [];
                    results.results.forEach(function (res) {
                      if (visibleLayers.length > 0 && !visibleLayers.includes(results.layer.layerRef.url + '/' + res.layerId)) {
                        rem.push(res.layerId);
                      }
                    });
                    rem.forEach(function (remid) {
                      results.results.splice(results.results.findIndex(function (r) {
                        return r.layerId === remid;
                      }), 1);
                    });
                  }

                  //results.results.forEach(res =>{
                  //  if(visibleLayers.length > 0 && !visibleLayers.includes(`${results.layer.layerRef.url}/${res.layerId}`))
                  //  {
                  //    results.results.splice(results.results.findIndex(r => r.layerId === res.layerId));
                  //  }
                  //})

                  if (results.results.length > 0) {
                    identresults.push(results);
                  }
                }

                cb();
              });
            }
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
            self.setState({ loading: false });
            results = results.flat();

            results = results.sort(function (r1, r2) {
              if (r1.acres < 0 && r2.acres < 0) return 0;
              if (r1.acres < 0) return 1;
              if (r2.acres < 0) return -1;
              if (r1.acres > r2.acres) {
                return 1;
              }
              if (r2.acres > r1.acres) {
                return -1;
              }
              return 0;
              //r.feature.attributes.Shape_Area
            });

            if (currentmode === "identify") {

              //results = results.reverse();
              var popupresults = results.map(function (result) {
                var feature = result.feature;
                var layerName = result.layerName;

                if (feature.attributes !== null) {
                  feature.attributes.layerName = layerName;
                }

                if (result.layer.layerRef && result.layer.layerRef.allSublayers && result.layer.layerRef.allSublayers.length > 0) {
                  var sublayer = result.layer.layerRef.allSublayers.find(function (l) {
                    return l.id === result.layerId;
                  });
                  if (sublayer) {
                    feature.attributes.layerUrl = sublayer.url;
                  }
                }

                if (result.layer.layerRenderers) {
                  //console.log("result.layer  this.layerRenderers", result);
                  var popupDisable = result.layer.layerRenderers.find(function (l) {
                    return l.props.layerid === result.layerId.toString();
                  });
                  //console.log("result.layer  popupDisable", popupDisable.props);
                  if (popupDisable && result.layerId == popupDisable.props.layerid) {
                    //console.log("result.layer  popupDisable", popupDisable.props);
                    if (popupDisable.props.disabled == "true") {
                      return null;
                    }
                  }
                }

                var PTActions = [];
                if (!result.layer.state.blockSelect) {
                  PTActions = [];
                } else {
                  PTActions = [{ title: "Select", id: "select-action" }];
                }

                feature.popupTemplate = { // autocasts as new PopupTemplate()
                  //title: layerName,
                  title: result.layer.renderPopupTitle(feature, result),
                  content: result.layer.renderPopup(feature, result),
                  actions: PTActions
                };

                return feature;
              });

              // remove the disabled popup layer
              for (var i = popupresults.length - 1; i >= 0; i--) {
                if (popupresults[i] == null) {
                  popupresults.splice(i, 1);
                }
              }
              //popupresults.forEach( function (result) {
              //  if (result == null) {
              //    popupresults.pop();
              //  } 
              //});

              if (popupresults.length > 0) {
                view.popup.close();
                view.popup.currentSearchResultFeature = null;
                self.state.view.popup.open({
                  features: popupresults,
                  location: event.mapPoint
                });
                // popupresults[0].setCurrentPopup();

                self.state.view.popup.on('trigger-action', function (e) {
                  if (e.action.id === 'select-action') ;
                });
              }
              self.setState({ loading: false });
            }

            if (currentmode === "select") {
              var feature = null;
              var fType = null;
              for (var idx = 0; idx < results.length && feature === null; idx++) {
                feature = results[idx].feature;
                fType = feature.geometry.type;
              }

              if (self.contextmenuPressed === true) {

                self.state.map.editor.setEditFeature(feature, null, fType, false, true, true);
              } else {

                self.state.map.editor.setEditFeature(feature, null, fType, false, true);
              }
            }

            //document.getElementsByClassName('esri-view-root')[0].style.cursor = 'auto';
          });

          // self.layers.forEach(layer => {
          //     layer.identify(event);
          // })
          //}, 100);
        });

        // Add widget to the top right corner of the view
        // self.state.view.ui.add(layerList, 'top-left')


        if (_this2.props.locate) {
          var locateBtn = new Locate({
            view: self.state.view
          });

          self.state.view.ui.add(locateBtn, {
            position: 'top-right'
          });
        }

        _this2.basemapGallery = new BasemapGallery({
          view: self.state.view
        });

        _this2.basemapGallery.watch('activeBasemap', function (newValue, oldValue, property, object) {
          self.state.view.ui.remove(self.basemapGallery);
          self.setState({ hideBasemapButton: false });
        });

        map.on("basemap-change", function (a) {
          //this.basemapGallery.on('click', function () {

          alert("BM CHanegd");
        });

        // Add the widget to the top-right corner of the view
        if (_this2.props.home) {
          var homeBtn = new Home({
            view: view
          });

          // Add the home button to the top left corner of the view
          view.ui.add(homeBtn, 'top-right');
        }

        view.ui.remove('zoom');

        _this2.getEditFeature = function () {
          _this2.state.map.editor.state.tempGraphicsLayer.graphics.items[0];
        };

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

ArcticMap.displayName = 'ArcticMap';

var ArcticMapLayer = function (_React$Component) {
    inherits(ArcticMapLayer, _React$Component);

    function ArcticMapLayer(props) {
        classCallCheck(this, ArcticMapLayer);

        var _this = possibleConstructorReturn(this, (ArcticMapLayer.__proto__ || Object.getPrototypeOf(ArcticMapLayer)).call(this, props));

        _this.state = {
            map: props.map,
            view: props.view,
            graphic: null,
            title: props.title,
            blockSelect: props.blockIdentSelect !== undefined,
            disablePopup: props.disablePopup !== undefined
        };
        return _this;
    }

    createClass(ArcticMapLayer, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.view.graphics.remove(this.state.graphic);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var self = this;
            reactArcgis.loadModules(['esri/Graphic', "esri/layers/FeatureLayer", "esri/layers/MapImageLayer", "esri/layers/ImageryLayer", "esri/layers/GraphicsLayer", "esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/layers/GroupLayer", "esri/renderers/Renderer"]).then(function (_ref) {
                var _ref2 = slicedToArray(_ref, 11),
                    Graphic = _ref2[0],
                    FeatureLayer = _ref2[1],
                    MapImageLayer = _ref2[2],
                    ImageryLayer = _ref2[3],
                    GraphicsLayer = _ref2[4],
                    IdentifyTask = _ref2[5],
                    IdentifyParameters = _ref2[6],
                    Point = _ref2[7],
                    SimpleMarkerSymbol = _ref2[8],
                    GroupLayer = _ref2[9],
                    Renderer = _ref2[10];

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

                var childrenEles = [];
                if (self.props.children) {
                    if (Array.isArray(self.props.children)) {
                        childrenEles = self.props.children;
                    } else {
                        childrenEles.push(self.props.children);
                    }
                }

                var renderers = childrenEles.filter(function (child) {
                    if (child.type.displayName === 'ArcticMapLayerRenderer') {
                        return child;
                    }
                });

                if (self.props.type === "feature") {
                    var flayers = self.props.sublayers;
                    if (!flayers || self.props.sublayers.length < 1) {
                        flayers = [{ id: 0, title: "" }];
                    }

                    var gmaplayer = new GroupLayer();

                    var trans = 1;
                    if (self.props.transparency) {
                        trans = Number.parseFloat(self.props.transparency);
                    }

                    flayers.forEach(function (sub) {
                        //portalItem
                        var glayer = new FeatureLayer({
                            title: sub.title,
                            outFields: ["*"],
                            opacity: gtrans
                        });
                        if (sub.visible === false) {
                            glayer.visible = false;
                        }

                        if (self.props.portalItem) {
                            glayer.portalItem = { id: self.props.src };
                            glayer.layerId = sub.id;
                        } else {
                            glayer.url = self.props.src + sub.id;
                        }

                        var renderer = renderers.find(function (r) {
                            if (r.props.layer === sub.title || r.props.layer === '' + sub.id) {
                                return r;
                            }
                        });
                        if (renderer !== undefined) {
                            glayer.renderer = renderer.props.style;
                        }

                        gmaplayer.layers.add(glayer);
                    });

                    var featureLayer = gmaplayer;
                    featureLayer.opacity = trans;

                    if (self.props.title) {
                        featureLayer.title = self.props.title;
                    }

                    self.layerRef = featureLayer;
                    //self.state.map.add(featureLayer);
                }

                if (self.props.type === "group") {
                    var gtrans = 1;
                    if (self.props.transparency) {
                        gtrans = Number.parseFloat(self.props.transparency);
                    }
                    var srcsplit = self.props.src.split(',');

                    var gmaplayer = new GroupLayer({
                        //url: self.props.src,
                        opacity: gtrans

                    });
                    if (self.props.title) {

                        gmaplayer.title = self.props.title;
                    }

                    var idx = 0;
                    srcsplit.forEach(function (src) {
                        var glayer = new MapImageLayer({
                            url: src,
                            opacity: gtrans

                        });

                        if (self.props.sublayers && self.props.sublayers.length > idx) {
                            glayer.sublayers = self.props.sublayers[idx];
                            idx++;
                        }

                        gmaplayer.layers.add(glayer);

                        glayer.when(function () {
                            var layerids = [];
                            //console.log("Maplayer: ", maplayer);
                            glayer.allSublayers.items.forEach(function (sublayer) {
                                layerids.push(sublayer.id);
                                var renderer = renderers.find(function (r) {
                                    if (r.props.layer === sublayer.title || r.props.layer === '' + sublayer.id) {
                                        return r;
                                    }
                                });
                                if (renderer !== undefined) {
                                    sublayer.renderer = renderer.props.style;
                                }
                                //sublayer.renderer = Renderer.fromJSON(renderer);
                            });
                            layerids.reverse();
                            if (src === srcsplit[srcsplit.length - 1]) {
                                self.identifyTask = new IdentifyTask(src);
                                self.params = new IdentifyParameters();
                                self.params.tolerance = 3;
                                self.params.layerIds = layerids;
                                self.params.layerOption = "visible";
                                self.params.width = self.state.view.width;
                                self.params.height = self.state.view.height;
                                self.params.returnGeometry = true;
                                self.params.returnGeometry = !self.state.blockSelect;
                                //  console.log(self.params);
                            }
                        });
                    });

                    self.layerRef = gmaplayer;
                    //self.state.map.add(gmaplayer);
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

                    if (self.props.sublayers) {
                        maplayer.sublayers = self.props.sublayers;
                    }

                    if (self.props.childsrc) ;

                    if (self.props.title) {

                        maplayer.title = self.props.title;
                    }

                    maplayer.on("layerview-create", function (event) {
                        // console.lof("Layerview:" , event)
                    });

                    maplayer.when(function () {
                        var layerids = [];
                        maplayer.allSublayers.items.forEach(function (sublayer) {
                            layerids.push(sublayer.id);
                            sublayer.when(function (e) {
                                if (self.props.sublayers !== undefined) {
                                    self.props.sublayers.forEach(function (sub) {
                                        if (sub.isVisible === false && e.id === sub.id) {
                                            e.visible = false;
                                        }
                                    });
                                }
                            });
                            var renderer = renderers.find(function (r) {
                                if (r.props.layer === sublayer.title || r.props.layer === '' + sublayer.id) {
                                    return r;
                                }
                            });
                            if (renderer !== undefined) {
                                sublayer.renderer = renderer.props.style;
                                if (renderer.props.displayTitle !== undefined) {
                                    sublayer.title = renderer.props.displayTitle;
                                }
                            }
                            //sublayer.renderer = Renderer.fromJSON(renderer);
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
                        self.params.returnGeometry = !self.state.blockSelect;
                    });

                    self.layerRef = maplayer;
                    //self.state.map.add(maplayer);
                }

                if (self.props.type === "image") {
                    var imagelayer = new ImageryLayer({
                        url: self.props.src,
                        format: "jpgpng" // server exports in either jpg or png format
                    });
                    self.layerRef = imagelayer;
                    //self.state.map.add(imagelayer);
                }

                if (self.props.type === "custom") {
                    self.layerRef = self.props.layerRef;
                    //self.state.map.add(self.props.layerRef);
                }
                // if (self.props.type === "geojson") {

                //     var geojsonLayer = new GraphicsLayer({ title: 'GeoJSON Layer', listMode: "hide" });
                //     // var geojsonLayer = new GeoJSONLayer({
                //     //     //source: self.props.src,
                //     //     //copyright: "USGS Earthquakes",
                //     //     //popupTemplate: template
                //     //   });
                //     var dataarr = [];

                //     if (typeof self.props.src === 'object') {
                //         if (self.props.src.features) {
                //             dataarr = self.props.src.features;
                //         }
                //         else {
                //             dataarr = self.props.src;
                //         }
                //     }

                //     if (self.props.title) {

                //         geojsonLayer.title = self.props.title;
                //     }


                //     dataarr.forEach(obj => {
                //         //var esrijson = geojsonToArcGIS(obj);
                //         if (obj.geometry.type === "Point") {

                //             var popupTemplate = {
                //                 title: "{Name}",
                //                 content: self.props.template,
                //             };


                //             var point = new Point({
                //                 longitude: obj.geometry.coordinates[1],
                //                 latitude: obj.geometry.coordinates[0],

                //             });

                //             // Create a symbol for drawing the point
                //             var markerSymbol = new SimpleMarkerSymbol({
                //                 color: [226, 119, 40],
                //                 outline: {
                //                     color: [255, 255, 255],
                //                     width: 1
                //                 }
                //             });

                //             // Create a graphic and add the geometry and symbol to it
                //             var pointGraphic = new Graphic({
                //                 geometry: point,
                //                 symbol: markerSymbol,
                //                 attributes: obj.properties,
                //                 popupTemplate: popupTemplate,
                //                 // extent : new Extent().centerAt(point)
                //             });

                //             // Add the graphic to the view
                //             geojsonLayer.graphics.add(pointGraphic);
                //         }


                //     })


                //     self.layerRef = geojsonLayer;
                //     self.state.map.add(geojsonLayer);
                //     // var imagelayer = new ImageryLayer({
                //     //     url: self.props.src,
                //     //     format: "jpgpng" // server exports in either jpg or png format
                //     // });
                //     // self.layerRef = imagelayer;
                //     // self.state.map.add(imagelayer);

                // }
                if (self.props.visible !== undefined && self.props.visible === "false") {
                    self.layerRef.visible = false;
                }

                self.state.map.add(self.layerRef);
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
        key: 'renderPopupTitle',
        value: function renderPopupTitle(feature, result) {
            if (result.layerId !== undefined && this.layerRenderers) {
                var popupTitle = this.layerRenderers.find(function (l) {
                    return l.props.layerid === result.layerId.toString();
                });
                if (popupTitle && result.layerId == popupTitle.props.layerid) {
                    if (popupTitle.props.popuptitle) return popupTitle.props.popuptitle;else return result.layerName;
                } else {
                    popupTitle = this.layerRenderers.find(function (l) {
                        return l.props.layerid === null;
                    });
                    if (popupTitle && popupTitle.props.popuptitle) return popupTitle.props.popuptitle;
                    return result.layerName;
                }
            } else {
                return result.layerName;
            }
        }
    }, {
        key: 'renderPopup',
        value: function renderPopup(feature, result) {

            if (result.layerId !== undefined && this.layerRenderers) {
                var popuprender = this.layerRenderers.find(function (l) {
                    return l.props.layerid === result.layerId.toString();
                });
                if (!popuprender) popuprender = this.layerRenderers.find(function (l) {
                    return l.props.layerid === null;
                });
                if (popuprender && popuprender.props.popup !== undefined) {
                    var ele = popuprender.props.popup(feature, result);

                    if (ele) {
                        var workingdiv = document.createElement('div');
                        ReactDOM.render(ele, workingdiv);
                        return workingdiv;
                    }
                }
            }

            var popupText = "";
            if (feature.attributes) {
                var atts = Object.getOwnPropertyNames(feature.attributes);
                atts.forEach(function (att) {
                    if (att === 'layerName') ; else {
                        popupText += '<b>' + att + '</b> : ' + feature.attributes[att] + '<br/>';
                    }
                });
            }

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

            var self = this;
            //console.log("identify", self)

            if (this.props.type === "geojson") {

                this.state.view.hitTest(event).then(function (htresponse) {

                    // console.log("Identify on geojson");
                    //console.log(htresponse);
                    var mapPoint = event.mapPoint;
                    var response = {
                        layer: self.layerRef,
                        results: htresponse.results.map(function (r) {
                            return { feature: r.graphic, layerName: self.layerRef.title };
                        })
                    };
                    callback(response);
                });
            } else if (this.props.type === "feature") {

                this.state.view.hitTest(event).then(function (htresponse) {

                    // console.log("Identify on geojson");
                    //console.log(htresponse);
                    var mapPoint = event.mapPoint;
                    var layersLeft = self.layerRef.layers.length;
                    var responses = [];
                    self.layerRef.layers.map(function (layer) {
                        layer.queryFeatures({
                            //query object
                            geometry: mapPoint,
                            spatialRelationship: "intersects",
                            returnGeometry: !self.state.blockSelect,
                            outFields: ["*"]
                        }).then(function (response) {
                            responses = responses.concat(response.features);
                            layersLeft--;

                            if (layersLeft < 1) {
                                var res = responses.map(function (feat) {
                                    return {
                                        feature: feat,
                                        layerName: feat.layer.title,
                                        layerId: feat.layer.layerId
                                    };
                                });

                                callback({ results: res });
                            }
                        });
                    });
                });
            } else {

                if (!this.params) {
                    callback(null);return;
                }

                this.params.geometry = event.mapPoint;
                this.params.mapExtent = this.state.view.extent;
                //this.params.returnGeometry = true;
                //document.getElementById("viewDiv").style.cursor = "wait";
                this.identifyTask.execute(this.params).then(function (response) {
                    //console.log("identifyTask here",response );
                    callback(response);
                });
            }
        }
    }, {
        key: 'identifyArea',
        value: function identifyArea(eventPS, eventPE, sublayers, callback) {
            var self = this;
            reactArcgis.loadModules(["esri/geometry/Multipoint"]).then(function (_ref3) {
                var _ref4 = slicedToArray(_ref3, 1),
                    Multipoint = _ref4[0];

                var points = new Multipoint();
                points.addPoint(eventPS);
                points.addPoint(eventPE);

                if (!self.params) {
                    callback(null);return;
                }

                var layerids = self.params.layerIds;

                self.params.layerIds = sublayers;
                self.params.geometry = points.extent;
                self.params.geometry.spatialReference = self.state.view.extent.spatialReference;
                self.params.mapExtent = self.state.view.extent;
                self.identifyTask.execute(self.params).then(function (response) {
                    self.params.layerIds = layerids;
                    console.log("identifyArea", response);
                    callback(response);
                });
            });
        }
    }]);
    return ArcticMapLayer;
}(React.Component);

ArcticMapLayer.displayName = "ArcticMapLayer";

var css$1 = "\r\n#ArcticMapEdit_topbar__2WB6X {\r\n    background: #fff;\r\n   \r\n   \r\n    padding: 2px;\r\n  }\r\n\r\n  .ArcticMapEdit_action-button__3NbvD {\r\n    display: block;\r\n    font-size: 16px;\r\n    background-color: transparent;\r\n    border: 1px solid #D3D3D3;\r\n    color: #6e6e6e;\r\n    height: 40px;\r\n    width: 125px;\r\n    text-align: center;\r\n    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);\r\n    padding: 2px;\r\n  }\r\n\r\n  .ArcticMapEdit_action-button__3NbvD:hover,\r\n  .ArcticMapEdit_action-button__3NbvD:focus {\r\n    background: #0079c1;\r\n    color: #e4e4e4;\r\n  }\r\n\r\n  .ArcticMapEdit_active__2wj6f {\r\n    background: #0079c1;\r\n    color: #e4e4e4;\r\n  }\r\n\r\n  .ArcticMapEdit_infoarea__3lIWX {\r\n    width: 300px;\r\n    word-wrap: break-word;\r\n    margin: 0px;\r\n  }\r\n\r\n  .ArcticMapEdit_hide_input__YO9De {\r\n    width:0px;\r\n  }\r\n  /* .btm_primary_file {\r\n    background-color: #005a70;\r\n    padding: 7px;\r\n    border: 1px solid #D3D3D3;\r\n    color: #D3D3D3;\r\n    height: 40px;\r\n    width: 125px;\r\n    text-align: center;\r\n    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);\r\n    border-radius: 5px;\r\n  } */\r\n  .ArcticMapEdit_btm_primary_file__3Zllg {\r\n    background-color: #005a70;\r\n    padding: 5px 10px 5px 10px;\r\n    border-width: 1px;\r\n    border-style: solid;\r\n    border-color: #dadbdd;\r\n    color: #e0ebeb;\r\n    text-align: center;\r\n    width: 125px;\r\n    border-radius: 5px;\r\n    fill-opacity: 100;\r\n    margin-bottom: 5px;\r\n    margin-top: 10px;\r\n    font: 400 13.3333px Arial;\r\n  }\r\n  input[type=\"file\"]\r\n  {\r\n    display: none;\r\n  }\r\n  .ArcticMapEdit_fileUpload__26x61 .ArcticMapEdit_upload__M4Fnc \r\n  {\r\n    display: inline-block;\r\n    background-color: #005a70;\r\n    color: #e0ebeb;\r\n  }";
var style$2 = { "topbar": "ArcticMapEdit_topbar__2WB6X", "action-button": "ArcticMapEdit_action-button__3NbvD", "active": "ArcticMapEdit_active__2wj6f", "infoarea": "ArcticMapEdit_infoarea__3lIWX", "hide_input": "ArcticMapEdit_hide_input__YO9De", "btm_primary_file": "ArcticMapEdit_btm_primary_file__3Zllg", "fileUpload": "ArcticMapEdit_fileUpload__26x61", "upload": "ArcticMapEdit_upload__M4Fnc" };
styleInject(css$1);

var ArcticMapEdit = function (_React$Component) {
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
            editing: false,
            showUploading: false,
            hidden: !_this.props.hidden ? false : true
        };

        _this.uploadPanel = React.createRef();

        ArcticMapEdit.defaultProps = {
            uploadPanelInfoAreaText: "Do you already have a shape of your case? Upload your file here. Supported geometries: polygon and polyline. Supported file types: Shapefiles (.zip), kml, gml, gpx, and geojson."
        };
        return _this;
    }

    createClass(ArcticMapEdit, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.props.view.graphics.remove(this.state.graphic);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            var self = this;
            reactArcgis.loadModules(["esri/Graphic", "esri/layers/GraphicsLayer", "esri/widgets/Sketch/SketchViewModel", "esri/geometry/Geometry", "esri/geometry/Polygon", "esri/geometry/Polyline", "esri/geometry/geometryEngine"]).then(function (_ref) {
                var _ref2 = slicedToArray(_ref, 7),
                    Graphic = _ref2[0],
                    GraphicsLayer = _ref2[1],
                    SketchViewModel = _ref2[2],
                    Geometry = _ref2[3],
                    Polygon = _ref2[4],
                    Polyline = _ref2[5],
                    geometryEngine = _ref2[6];

                var tempGraphicsLayer = new GraphicsLayer({ title: 'Edit Layer', listMode: "hide" });
                self.setState({ tempGraphicsLayer: tempGraphicsLayer });

                self.state.map.add(tempGraphicsLayer);

                var sketchViewModel = new SketchViewModel({
                    view: self.state.view,
                    layer: tempGraphicsLayer,
                    defaultUpdateOptions: {
                        // toggleToolOnClick : false
                    },
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

                if (_this2.props.updateongraphicclick !== undefined) {
                    sketchViewModel.updateOnGraphicClick = _this2.props.updateongraphicclick;
                }

                self.setState({ tempGraphicsLayer: tempGraphicsLayer, sketchViewModel: sketchViewModel });

                self.setUpClickHandler.bind(_this2);

                sketchViewModel.on("create", function (event) {

                    if (event.state === 'complete') {

                        tempGraphicsLayer.graphics = [event.graphic];
                        if (_this2.props.single) {

                            _this2.setState({ hideEditors: true });
                        }

                        setTimeout(function () {

                            self.setState({ geojson: arcgisToGeojsonUtils.arcgisToGeoJSON(event.graphic.geometry.toJSON()), datajson: event.graphic.toJSON(), editing: false });
                            self.firenewfeature();
                        }, 1000);
                    }
                });

                sketchViewModel.on("update", function (event) {
                    self.setState({ editing: true });
                    if (event.state === 'start' && self.state.mode === 'select') {
                        return false;
                    }
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

                        setTimeout(function () {
                            self.setState({ geojson: arcgisToGeojsonUtils.arcgisToGeoJSON(event.graphics[0].geometry.toJSON()), datajson: event.graphics[0].toJSON() });
                            //this.geojson = event.geometry;
                            self.firenewfeature();
                        }, 1000);
                    }
                });

                // Listen the sketchViewModel's update-complete and update-cancel events
                sketchViewModel.on("update-complete", function (event) {
                    event.graphic.geometry = event.geometry;
                    tempGraphicsLayer.graphics = [event.graphic];
                    //tempGraphicsLayer.add(event.graphic);

                    // set the editGraphic to null update is complete or cancelled.
                    self.state.editGraphic = null;
                });

                _this2.top_right_node = document.createElement("div");
                self.state.view.ui.add(_this2.top_right_node, "top-right");

                self.setState({ loaded: true });

                //self.setUpClickHandler();

                // scoped methods
                self.setEditFeature = function (feature, nofire, type, zoomto, addto, trim) {

                    if (nofire === null) {
                        nofire = false;
                    }

                    if (type === null) {
                        type = "polygon";
                    }

                    if (zoomto === null) {
                        zoomto = true;
                    }

                    if (addto === null) {
                        addto = false;
                    }
                    if (trim === null) {
                        trim = false;
                    }

                    if (feature.attributes.layerName) {
                        feature.sourceLayer = feature.attributes.layerName.trim();
                    } else {
                        feature.sourceLayer = 'PLSS';
                    }

                    if (!feature.geometry.type) {
                        if (type === "polygon") {

                            feature.geometry = new Polygon(feature.geometry);
                            feature.geometry.type = "polygon";
                        }
                        if (type === "polyline") {
                            feature.geometry = new Polyline(feature.geometry);
                            feature.geometry.type = "polyline";
                        }
                    }

                    _this2.state.sketchViewModel.cancel();
                    if (!addto) {
                        _this2.state.tempGraphicsLayer.removeAll();
                    }
                    _this2.setState({ hideEditors: false, geojson: null });

                    var graphic = null;
                    if (!feature.geometry.toJSON && feature.symbol) {
                        graphic = Graphic.fromJSON(feature);
                    } else {
                        if (feature.geometry.type === "polygon") {
                            graphic = new Graphic({
                                geometry: feature.geometry,
                                symbol: _this2.state.sketchViewModel.polygonSymbol
                            });
                        }
                        if (feature.geometry.type === "polyline") {
                            graphic = new Graphic({
                                geometry: feature.geometry,
                                symbol: _this2.state.sketchViewModel.polylineSymbol
                            });
                        }
                    }

                    if (graphic.geometry === null) {
                        graphic.geometry = feature.geometry;
                    }

                    if (trim) {
                        if (_this2.state.tempGraphicsLayer.graphics.items.length > 0) {

                            var geometrys = _this2.state.tempGraphicsLayer.graphics.items.map(function (i) {
                                return i.geometry;
                            });

                            var merge = geometryEngine.union(geometrys);
                            var isEqual = geometryEngine.equals(merge, graphic.geometry);
                            if (!isEqual) {
                                merge = geometryEngine.difference(merge, graphic.geometry);
                                graphic = new Graphic({
                                    geometry: merge,
                                    symbol: _this2.state.sketchViewModel.polygonSymbol
                                });
                                graphic.geometry.sourceLayer = feature.sourceLayer;
                                _this2.state.tempGraphicsLayer.graphics = [graphic];
                            } else {
                                _this2.state.tempGraphicsLayer.graphics = null;
                            }
                        }
                    } else {
                        _this2.state.tempGraphicsLayer.add(graphic);

                        if (_this2.state.tempGraphicsLayer.graphics.items.length > 0) {

                            var geometrys = _this2.state.tempGraphicsLayer.graphics.items.map(function (i) {
                                return i.geometry;
                            });

                            var merge = geometryEngine.union(geometrys);
                            if (merge.type === "polygon") {
                                graphic = new Graphic({
                                    geometry: merge,
                                    symbol: _this2.state.sketchViewModel.polygonSymbol
                                });
                            }
                            if (merge.type === "polyline") {
                                graphic = new Graphic({
                                    geometry: merge,
                                    symbol: _this2.state.sketchViewModel.polylineSymbol
                                });
                            }
                            graphic.geometry.sourceLayer = feature.sourceLayer;
                            _this2.state.tempGraphicsLayer.graphics = [graphic];
                        }
                    }
                    //this.state.tempGraphicsLayer.graphics = [graphic];
                    if (_this2.props.single) {

                        _this2.setState({ hideEditors: true });
                    }

                    if (zoomto) {

                        self.state.view.goTo(graphic);
                    }

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
        key: "fileUploaded",
        value: function fileUploaded(evt) {
            var self = this;
            var fileName = evt.target.value.toLowerCase();
            if (fileName.indexOf(".zip") !== -1) {
                // console.log("addEventListener", self);
                self.processShapeFile(fileName, evt.target);
            } else if (fileName.indexOf(".kml") !== -1) {
                // console.log("addEventListener", self);
                self.processKMLFile(fileName, evt.target);
            } else if (fileName.indexOf(".geojson") !== -1) {
                // console.log("addEventListener", self);

                self.processGeojsonFile(fileName, evt.target);
            } else if (fileName.indexOf(".gml") !== -1) {
                // console.log("addEventListener", self);

                self.processGMLFile(fileName, evt.target);
            } else if (fileName.indexOf(".gpx") !== -1) {
                // console.log("addEventListener", self);

                self.processGPXFile(fileName, evt.target);
            } else {
                document.getElementById("upload-status").innerHTML = '<p style="color:red">Only shapefile(.zip), .gml, .gpx, .kml, or .geojson are supported</p>';
            }
        }
    }, {
        key: "readTextFile",
        value: function readTextFile(file) {
            return new Promise(function (res, rej) {
                var fr = new FileReader();
                fr.onload = function (evt) {
                    res(evt.target.result);
                };
                fr.readAsText(file);
            });
        }
    }, {
        key: "kmlColor",
        value: function kmlColor(v) {
            var color, opacity;
            v = v || '';
            if (v.substr(0, 1) === '#') {
                v = v.substr(1);
            }
            if (v.length === 6 || v.length === 3) {
                color = v;
            }
            if (v.length === 8) {
                opacity = parseInt(v.substr(0, 2), 16) / 255;
                color = '#' + v.substr(6, 2) + v.substr(4, 2) + v.substr(2, 2);
            }
            return [color, isNaN(opacity) ? undefined : opacity];
        }
    }, {
        key: "processGPXFile",
        value: function processGPXFile(fileName, form) {
            var file = fileName.replace(/^.*[\\\/]/, '');
            var self = this;
            this.readTextFile(form.files[0]).then(function (text) {
                var parser = new DOMParser();
                var gj = self.fc();
                var xmlDoc = parser.parseFromString(text, "text/xml");
                var trkMember = self.get(xmlDoc, "trk");
                for (var j = 0; j < trkMember.length; j++) {
                    gj.features = gj.features.concat(self.getTRKMember(trkMember[j]));
                }
                var features = [];
                gj.features.forEach(function (f) {
                    var esrijson = arcgisToGeojsonUtils.geojsonToArcGIS(f);
                    features.push(esrijson);
                });
                if (self.addGeojsonToMap(features, file, "GPX")) self.uploadPanel.current.toggle();
            });
        }
    }, {
        key: "getTRKMember",
        value: function getTRKMember(root) {
            var geometryProperty = this.get(root, "trkseg");
            var geomsCoord = this.getGeometry(geometryProperty[0]);
            var feature = {
                type: 'Feature',
                geometry: geomsCoord.geoms.length === 1 ? geomsCoord.geoms[0] : {
                    type: 'GeometryCollection',
                    geometries: geomsCoord.geoms
                }
                //properties: properties
            };
            if (this.attr(root, 'id')) feature.id = this.attr(root, 'id');
            return [feature];
        }
    }, {
        key: "processGMLFile",
        value: function processGMLFile(fileName, form) {
            var file = fileName.replace(/^.*[\\\/]/, '');
            var self = this;
            this.readTextFile(form.files[0]).then(function (text) {
                var parser = new DOMParser();
                var gj = self.fc();
                var xmlDoc = parser.parseFromString(text, "text/xml");
                var Polygon = self.get(xmlDoc, "gml:Polygon");
                var LineString = self.get(xmlDoc, "gml:LineString");
                var sr = 0;
                if (Polygon.length > 0) {
                    var srp = Polygon[0].attributes["srsName"].nodeValue.split(":");
                    sr = srp[srp.length - 1];
                } else if (LineString.length > 0) {
                    var srp = LineString[0].attributes["srsName"].nodeValue.split(":");
                    sr = srp[srp.length - 1];
                }
                var featureMember = self.get(xmlDoc, "gml:featureMember");
                for (var j = 0; j < featureMember.length; j++) {
                    gj.features = gj.features.concat(self.getFeatureMember(featureMember[j]));
                }
                var features = [];

                gj.features.forEach(function (f) {
                    var esrijson = arcgisToGeojsonUtils.geojsonToArcGIS(f);
                    esrijson.geometry.spatialReference.wkid = sr;
                    features.push(esrijson);
                });
                if (self.addGeojsonToMap(features, file, "GML")) self.uploadPanel.current.toggle();
            });
        }
    }, {
        key: "getFeatureMember",
        value: function getFeatureMember(root) {
            var geometryProperty = this.get(root, "ogr:geometryProperty");
            var geomsCoord = this.getGeometry(geometryProperty[0]);
            var feature = {
                type: 'Feature',
                geometry: geomsCoord.geoms.length === 1 ? geomsCoord.geoms[0] : {
                    type: 'GeometryCollection',
                    geometries: geomsCoord.geoms
                }
                //properties: properties
            };
            if (this.attr(root, 'id')) feature.id = this.attr(root, 'id');
            return [feature];
        }
    }, {
        key: "getGeometry",
        value: function getGeometry(root) {

            var geotypes = ['LineString', 'gml:LineString', 'Polygon', 'Point', 'Track', 'gx:Track', 'gml:Polygon', 'trkpt'];
            var geomNode,
                geomNodes,
                i,
                j,
                k,
                geoms = [],
                coordTimes = [];
            if (this.get1(root, 'MultiGeometry')) {
                return this.getGeometry(this.get1(root, 'MultiGeometry'));
            }
            if (this.get1(root, 'MultiTrack')) {
                return this.getGeometry(this.get1(root, 'MultiTrack'));
            }
            if (this.get1(root, 'gx:MultiTrack')) {
                return this.getGeometry(this.get1(root, 'gx:MultiTrack'));
            }
            if (this.get1(root, 'trkpt')) {
                geomNodes = this.get(root, 'trkpt');
                coords = [];
                for (k = 0; k < geomNodes.length; k++) {
                    coords.push([parseFloat(geomNodes[k].attributes[1].nodeValue), parseFloat(geomNodes[k].attributes[0].nodeValue)]);
                }
                geoms.push({
                    type: 'Polygon',
                    coordinates: [coords]
                });
            }
            for (i = 0; i < geotypes.length; i++) {
                geomNodes = this.get(root, geotypes[i]);
                if (geomNodes) {
                    for (j = 0; j < geomNodes.length; j++) {
                        geomNode = geomNodes[j];
                        if (geotypes[i] === 'Point') {
                            geoms.push({
                                type: 'Point',
                                coordinates: this.coord1(this.nodeVal(this.get1(geomNode, 'coordinates')))
                            });
                        } else if (geotypes[i] === 'LineString') {
                            geoms.push({
                                type: 'LineString',
                                coordinates: this.coord(this.nodeVal(this.get1(geomNode, 'coordinates')))
                            });
                        } else if (geotypes[i] === 'gml:LineString') {
                            geoms.push({
                                type: 'LineString',
                                coordinates: this.coord(this.nodeVal(this.get1(geomNode, 'gml:coordinates')))
                            });
                        } else if (geotypes[i] === 'Polygon') {
                            var rings = this.get(geomNode, 'LinearRing'),
                                coords = [];
                            for (k = 0; k < rings.length; k++) {

                                coords.push(this.coord(this.nodeVal(this.get1(rings[k], 'coordinates'))));
                            }
                            geoms.push({
                                type: 'Polygon',
                                coordinates: coords
                            });
                        } else if (geotypes[i] === 'gml:Polygon') {
                            var rings = this.get(geomNode, 'gml:LinearRing'),
                                coords = [];
                            for (k = 0; k < rings.length; k++) {

                                coords.push(this.coord(this.nodeVal(this.get1(rings[k], 'gml:coordinates'))));
                            }
                            geoms.push({
                                type: 'Polygon',
                                coordinates: coords
                            });
                        } else if (geotypes[i] === 'Track' || geotypes[i] === 'gx:Track') {
                            var track = this.gxCoords(geomNode);
                            geoms.push({
                                type: 'LineString',
                                coordinates: track.coords
                            });
                            if (track.times.length) coordTimes.push(track.times);
                        }
                    }
                }
            }

            return {
                geoms: geoms,
                coordTimes: coordTimes
            };
        }
    }, {
        key: "nodeVal",
        value: function nodeVal(x) {
            if (x) {
                this.norm(x);
            }
            return x && x.textContent || '';
        }
    }, {
        key: "fc",
        value: function fc() {
            return {
                type: 'FeatureCollection',
                features: []
            };
        }
    }, {
        key: "xml2str",
        value: function xml2str(str) {
            var serializer;
            if (typeof XMLSerializer !== 'undefined') {
                /* istanbul ignore next */
                serializer = new XMLSerializer();
            }
            if (str.xml !== undefined) return str.xml;
            return serializer.serializeToString(str);
        }
    }, {
        key: "okhash",
        value: function okhash(x) {
            if (!x || !x.length) return 0;
            for (var i = 0, h = 0; i < x.length; i++) {
                h = (h << 5) - h + x.charCodeAt(i) | 0;
            }return h;
        }
    }, {
        key: "get",
        value: function get$$1(x, y) {
            return x.getElementsByTagName(y);
        }
    }, {
        key: "attr",
        value: function attr(x, y) {
            return x.getAttribute(y);
        }
    }, {
        key: "attrf",
        value: function attrf(x, y) {
            return parseFloat(this.attr(x, y));
        }
    }, {
        key: "get1",
        value: function get1(x, y) {
            var n = this.get(x, y);
            return n.length ? n[0] : null;
        }
    }, {
        key: "norm",
        value: function norm(el) {
            if (el.normalize) {
                el.normalize();
            }return el;
        }
    }, {
        key: "coord1",
        value: function coord1(v) {
            var removeSpace = /\s*/g;
            return this.numarray(v.replace(removeSpace, '').split(','));
        }
    }, {
        key: "coord",
        value: function coord(v) {
            var trimSpace = /^\s*|\s*$/g;
            var splitSpace = /\s+/;
            var coords = v.replace(trimSpace, '').split(splitSpace),
                o = [];

            for (var i = 0; i < coords.length; i++) {
                o.push(this.coord1(coords[i]));
            }

            return o;
        }
    }, {
        key: "gxCoord",
        value: function gxCoord(v) {
            return this.numarray(v.split(' '));
        }
    }, {
        key: "numarray",
        value: function numarray(x) {

            for (var j = 0, o = []; j < x.length; j++) {
                o[j] = parseFloat(x[j]);
            }
            return o;
        }
    }, {
        key: "gxCoords",
        value: function gxCoords(root) {
            var elems = this.get(root, 'coord', 'gx'),
                coords = [],
                times = [];
            if (elems.length === 0) elems = this.get(root, 'gx:coord');
            for (var i = 0; i < elems.length; i++) {
                coords.push(this.gxCoord(this.nodeVal(elems[i])));
            }var timeElems = this.get(root, 'when');
            for (var j = 0; j < timeElems.length; j++) {
                times.push(this.nodeVal(timeElems[j]));
            }return {
                coords: coords,
                times: times
            };
        }
    }, {
        key: "processKMLFile",
        value: function processKMLFile(fileName, form) {
            var file = fileName.replace(/^.*[\\\/]/, '');
            var self = this;

            this.readTextFile(form.files[0]).then(function (text) {
                var parser = new DOMParser();
                var gj = self.fc();
                var xmlDoc = parser.parseFromString(text, "text/xml");
                var placemarks = self.get(xmlDoc, "Placemark");
                var styles = self.get(xmlDoc, "Style");
                var styleMaps = self.get(xmlDoc, "StyleMap");
                var styleIndex = {};
                var styleByHash = {};
                var styleMapIndex = {};
                for (var k = 0; k < styles.length; k++) {
                    var hash = self.okhash(self.xml2str(styles[k])).toString(16);
                    styleIndex['#' + self.attr(styles[k], 'id')] = hash;
                    styleByHash[hash] = styles[k];
                }
                for (var l = 0; l < styleMaps.length; l++) {
                    styleIndex['#' + self.attr(styleMaps[l], 'id')] = self.okhash(self.xml2str(styleMaps[l])).toString(16);
                    var pairs = self.get(styleMaps[l], 'Pair');
                    var pairsMap = {};
                    for (var m = 0; m < pairs.length; m++) {
                        pairsMap[self.nodeVal(self.get1(pairs[m], 'key'))] = self.nodeVal(self.get1(pairs[m], 'styleUrl'));
                    }
                    styleMapIndex['#' + self.attr(styleMaps[l], 'id')] = pairsMap;
                }
                for (var j = 0; j < placemarks.length; j++) {
                    gj.features = gj.features.concat(self.getPlacemark(placemarks[j]));
                }

                var features = [];

                gj.features.forEach(function (f) {
                    var esrijson = arcgisToGeojsonUtils.geojsonToArcGIS(f);
                    features.push(esrijson);
                });
                if (self.addGeojsonToMap(features, file, "KML")) self.uploadPanel.current.toggle();
            });
        }
    }, {
        key: "getPlacemark",
        value: function getPlacemark(root) {
            var geomsAndTimes = this.getGeometry(root),
                i,
                properties = {},
                name = this.nodeVal(this.get1(root, 'name')),
                address = this.nodeVal(this.get1(root, 'address')),
                styleUrl = this.nodeVal(this.get1(root, 'styleUrl')),
                styleIndex = {},
                styleMapIndex = {},
                styleByHash = {},
                description = this.nodeVal(this.get1(root, 'description')),
                timeSpan = this.get1(root, 'TimeSpan'),
                timeStamp = this.get1(root, 'TimeStamp'),
                extendedData = this.get1(root, 'ExtendedData'),
                lineStyle = this.get1(root, 'LineStyle'),
                polyStyle = this.get1(root, 'PolyStyle'),
                visibility = this.get1(root, 'visibility');

            if (!geomsAndTimes.geoms.length) return [];
            if (name) properties.name = name;
            if (address) properties.address = address;

            if (styleUrl) {
                if (styleUrl[0] !== '#') {
                    styleUrl = '#' + styleUrl;
                }
                properties.styleUrl = styleUrl;
                if (styleIndex[styleUrl]) {
                    properties.styleHash = styleIndex[styleUrl];
                }
                if (styleMapIndex[styleUrl]) {
                    properties.styleMapHash = styleMapIndex[styleUrl];
                    properties.styleHash = styleIndex[styleMapIndex[styleUrl].normal];
                }
                var style = styleByHash[properties.styleHash];
                if (style) {
                    if (!lineStyle) lineStyle = this.get1(style, 'LineStyle');
                    if (!polyStyle) polyStyle = this.get1(style, 'PolyStyle');
                    var iconStyle = this.get1(style, 'IconStyle');
                    if (iconStyle) {
                        var icon = this.get1(iconStyle, 'Icon');
                        if (icon) {
                            var href = this.nodeVal(this.get1(icon, 'href'));
                            if (href) properties.icon = href;
                        }
                    }
                }
                if (description) properties.description = description;
                if (timeSpan) {
                    var begin = this.nodeVal(this.get1(timeSpan, 'begin'));
                    var end = this.nodeVal(this.get1(timeSpan, 'end'));
                    properties.timespan = { begin: begin, end: end };
                }
                if (timeStamp) {
                    properties.timestamp = this.nodeVal(this.get1(timeStamp, 'when'));
                }
                if (lineStyle) {
                    var linestyles = this.kmlColor(this.nodeVal(this.get1(lineStyle, 'color'))),
                        color = linestyles[0],
                        opacity = linestyles[1],
                        width = parseFloat(this.nodeVal(this.get1(lineStyle, 'width')));
                    if (color) properties.stroke = color;
                    if (!isNaN(opacity)) properties['stroke-opacity'] = opacity;
                    if (!isNaN(width)) properties['stroke-width'] = width;
                }
                if (polyStyle) {
                    var polystyles = this.kmlColor(this.nodeVal(this.get1(polyStyle, 'color'))),
                        pcolor = polystyles[0],
                        popacity = polystyles[1],
                        fill = this.nodeVal(this.get1(polyStyle, 'fill')),
                        outline = this.nodeVal(this.get1(polyStyle, 'outline'));
                    if (pcolor) properties.fill = pcolor;
                    if (!isNaN(popacity)) properties['fill-opacity'] = popacity;
                    if (fill) properties['fill-opacity'] = fill === '1' ? properties['fill-opacity'] || 1 : 0;
                    if (outline) properties['stroke-opacity'] = outline === '1' ? properties['stroke-opacity'] || 1 : 0;
                }
                if (extendedData) {
                    var datas = this.get(extendedData, 'Data'),
                        simpleDatas = this.get(extendedData, 'SimpleData');

                    for (i = 0; i < datas.length; i++) {
                        properties[datas[i].getAttribute('name')] = this.nodeVal(this.get1(datas[i], 'value'));
                    }
                    for (i = 0; i < simpleDatas.length; i++) {
                        properties[simpleDatas[i].getAttribute('name')] = this.nodeVal(simpleDatas[i]);
                    }
                }

                if (visibility) {
                    properties.visibility = this.nodeVal(visibility);
                }

                if (geomsAndTimes.coordTimes.length) {
                    properties.coordTimes = geomsAndTimes.coordTimes.length === 1 ? geomsAndTimes.coordTimes[0] : geomsAndTimes.coordTimes;
                }

                var feature = {
                    type: 'Feature',
                    geometry: geomsAndTimes.geoms.length === 1 ? geomsAndTimes.geoms[0] : {
                        type: 'GeometryCollection',
                        geometries: geomsAndTimes.geoms
                    },
                    properties: properties
                };
                if (this.attr(root, 'id')) feature.id = this.attr(root, 'id');
                return [feature];
            } else {

                var feature = {
                    type: 'Feature',
                    geometry: geomsAndTimes.geoms.length === 1 ? geomsAndTimes.geoms[0] : {
                        type: 'GeometryCollection',
                        geometries: geomsAndTimes.geoms
                    },
                    properties: properties
                };
                if (this.attr(root, 'id')) feature.id = this.attr(root, 'id');
                return [feature];
            }
        }
    }, {
        key: "processGeojsonFile",
        value: function processGeojsonFile(fileName, form) {

            var file = fileName.replace(/^.*[\\\/]/, '');
            var self = this;

            this.readTextFile(form.files[0]).then(function (text) {

                var geojson = JSON.parse(text);
                var sr = 0;
                if (geojson.crs && geojson.crs.properties) {
                    var srp = geojson.crs.properties.name.split(":");
                    sr = srp[srp.length - 1];
                }
                var features = [];

                geojson.features.forEach(function (f) {
                    var esrijson = arcgisToGeojsonUtils.geojsonToArcGIS(f);
                    esrijson.geometry.spatialReference.wkid = sr;

                    features.push(esrijson);
                });

                if (self.addGeojsonToMap(features, file, "GEOJSON")) self.uploadPanel.current.toggle();
            });
        }
    }, {
        key: "processShapeFile",
        value: function processShapeFile(fileName, form) {

            var self = this;
            //self.uploadPanel.current.toggle();
            var name = fileName.split(".");
            name = name[0].replace("c:\\fakepath\\", "");

            var fd = form.files[0];
            var JSZip = require('jszip')();

            JSZip.loadAsync(fd).then(function (zipEntries) {
                var prjfile = null;
                zipEntries.forEach(function (rp, zipEntry) {
                    if (zipEntry.name.indexOf(".prj") !== -1) {
                        prjfile = zipEntry;
                    }
                });
                if (prjfile == null) {
                    document.getElementById("upload-status").innerHTML = '<p style="color:red">The expected datums are NAD 83 (wkid 4269) or<br>WGS 84 (wkid 102100 (3857)), the data uploaded<br>was found outside the expected datums and<br>failed to upload, for further information<br>please reference knowledge article<br><a href="https://qa-blm.cs32.force.com/s/article/Acceptable-Datums-in-MLRS-NAD83-and-WGS84" target="_blank">Acceptable Datums in MLRS - NAD83 and WGS84.</a></p>';
                    return;
                }
                prjfile.async('text').then(function (text) {

                    var datums = {
                        4269: ["nad83", "northamericandatum1983", "gcsnorthamerican1983", "dnorthamerican1983", "nad83(1986)", "nad83(1986)-latlon", "nad83(original)"],
                        3857: ["wgs84/pseudo-mercator", "wgs1984webmercatorauxiliarysphere", "wgs84/popularvisualisationpseudo-mercator", "webmercator", "mercator1sp"],
                        102100: ["wgs84/pseudo-mercator", "wgs1984webmercatorauxiliarysphere", "wgs84/popularvisualisationpseudo-mercator", "webmercator", "mercator1sp"],
                        4326: ["gcswgs1984", "dwgs1984", "wgs84", "wgs1984", "worldgeodeticsystem1984"]
                    };
                    if (self.props.uploadSR) {
                        var srs = self.props.uploadSR.split(',');
                        var validsr = srs.length < 1;
                        for (var i = 0; i < srs.length; i++) {
                            if (text.includes(srs[i])) {
                                validsr = true;
                                break;
                            }
                        }
                        if (!validsr) {
                            text = text.toLowerCase();
                            text = text.replace(/_/g, '');
                            text = text.replace(/\s/g, '');
                            for (var i = 0; i < srs.length; i++) {
                                var datum = datums[srs[i]];
                                if (datum) {
                                    for (var j = 0; j < datum.length; j++) {
                                        if (text.includes(datum[j])) {
                                            validsr = true;
                                            break;
                                        }
                                    }
                                    if (validsr) break;
                                }
                            }
                        }
                        if (!validsr) {
                            //TODO should not be hardcoded
                            document.getElementById("upload-status").innerHTML = '<p style="color:red">The expected datums are NAD 83 (wkid 4269) or<br>WGS 84 (wkid 102100 (3857)), the data uploaded<br>was found outside the expected datums and<br>failed to upload, for further information<br>please reference knowledge article<br><a href="https://qa-blm.cs32.force.com/s/article/Acceptable-Datums-in-MLRS-NAD83-and-WGS84" target="_blank">Acceptable Datums in MLRS - NAD83 and WGS84.</a></p>';
                            return false;
                        }
                    }
                    var parms = {
                        name: name,
                        targetSR: self.state.view.extent.spatialReference,
                        maxRecordCount: 1000,
                        enforceInputFileSizeLimit: true,
                        enforceOutputJsonSizeLimit: true
                    };

                    parms.generalize = true;
                    parms.maxAllowableOffset = 10;
                    parms.reducePrecision = true;
                    parms.numberOfDigitsAfterDecimal = 0;
                    var myContent = {
                        filetype: "shapefile",
                        publishParameters: JSON.stringify(parms),
                        f: "json",
                        'content-type': 'multipart/form-data'
                    };

                    var portalUrl = "https://www.arcgis.com";

                    var query = Object.keys(myContent).map(function (k) {
                        return escape(k) + '=' + escape(myContent[k]);
                    }).join('&');

                    reactArcgis.loadModules(['esri/request']).then(function (_ref3) {
                        var _ref4 = slicedToArray(_ref3, 1),
                            request = _ref4[0];

                        request(portalUrl + "/sharing/rest/content/features/generate", {
                            query: myContent,
                            body: new FormData(form.form),
                            //body: document.getElementById("uploadForm"),
                            responseType: "json"
                        }).then(function (response) {
                            var layerName = response.data.featureCollection.layers[0].layerDefinition.name;
                            if (self.addShapefileToMap(response.data.featureCollection, layerName)) self.uploadPanel.current.toggle();
                        });
                    });
                });
            });
        }
    }, {
        key: "addShapefileToMap",
        value: function addShapefileToMap(featureCollection, layerName) {
            var self = this;
            if (this.props.uploadSR) {
                if (featureCollection.layers.length > 0 && featureCollection.layers[0].featureSet.features.length > 0) {
                    var sr = featureCollection.layers[0].featureSet.features[0].geometry.spatialReference.wkid;
                    var srs = this.props.uploadSR.split(',');
                    var validsr = srs.length < 1;
                    for (var i = 0; i < srs.length; i++) {
                        if (sr == srs[i]) validsr = true;
                    }

                    if (!validsr) {
                        //TODO should not be hardcoded
                        document.getElementById("upload-status").innerHTML = '<p style="color:red">The expected datums are NAD 83 (wkid 4269) or<br>WGS 84 (wkid 102100 (3857)), the data uploaded<br>was found outside the expected datums and<br>failed to upload, for further information<br>please reference knowledge article<br><a href="https://qa-blm.cs32.force.com/s/article/Acceptable-Datums-in-MLRS-NAD83-and-WGS84" target="_blank">Acceptable Datums in MLRS - NAD83 and WGS84.</a></p>';
                        return false;
                    }
                }
            }
            reactArcgis.loadModules(['esri/Graphic', 'esri/layers/FeatureLayer', 'esri/layers/support/Field', 'esri/PopupTemplate']).then(function (_ref5) {
                var _ref6 = slicedToArray(_ref5, 4),
                    Graphic = _ref6[0],
                    FeatureLayer = _ref6[1],
                    Field = _ref6[2],
                    PopupTemplate = _ref6[3];

                var sourceGraphics = [];
                var layers = featureCollection.layers.map(function (layer) {

                    var graphics = layer.featureSet.features.map(function (feature) {
                        var gfx = Graphic.fromJSON(feature);
                        gfx.symbol = {
                            type: "simple-fill", // autocasts as new SimpleFillSymbol()
                            color: "rgba(224, 206, 69, 0.8)",
                            style: "solid",
                            outline: {
                                color: "yellow",
                                width: 3
                            }
                        };
                        return gfx;
                    });
                    sourceGraphics = sourceGraphics.concat(graphics);
                    var featureLayer = new FeatureLayer({
                        title: "SHP File: " + layerName,
                        //objectIDField: "FID",
                        source: graphics,
                        fields: layer.layerDefinition.fields.map(function (field) {
                            return Field.fromJSON(field);
                        })
                    });
                    return featureLayer;
                });

                layers[0].title = layerName;

                self.state.map.addMany(layers);

                self.state.view.goTo(sourceGraphics);

                var props = {
                    title: "Shape File: " + layerName,
                    transparency: ".32",
                    identmaxzoom: "13",
                    blockidentselect: true,
                    type: "geojson",
                    src: "",
                    map: self.state.map,
                    view: self.state.view
                };

                var aml = new ArcticMapLayer(props);
                aml.layerRef = layers[0];
                aml.context = window._map.layers[0].context;
                aml.layerRef.title = props.title;

                self.state.map.amlayers.push(aml);
            });
            return true;
        }
    }, {
        key: "addGeojsonToMap",
        value: function addGeojsonToMap(featureCollection, layerName, filetype) {
            var self = this;
            if (this.props.uploadSR) {
                if (featureCollection.length > 0) {
                    var sr = featureCollection[0].geometry.spatialReference.wkid;
                    var srs = this.props.uploadSR.split(',');
                    var validsr = srs.length < 1;
                    for (var i = 0; i < srs.length; i++) {
                        if (sr == srs[i]) validsr = true;
                    }

                    if (!validsr) {
                        //TODO should not be hardcoded
                        document.getElementById("upload-status").innerHTML = '<p style="color:red">The expected datums are NAD 83 (wkid 4269) or<br>WGS 84 (wkid 102100 (3857)), the data uploaded<br>was found outside the expected datums and<br>failed to upload, for further information<br>please reference knowledge article<br><a href="https://qa-blm.cs32.force.com/s/article/Acceptable-Datums-in-MLRS-NAD83-and-WGS84" target="_blank">Acceptable Datums in MLRS - NAD83 and WGS84.</a></p>';
                        return false;
                    }
                }
            }

            reactArcgis.loadModules(['esri/Graphic', 'esri/layers/FeatureLayer', 'esri/layers/support/Field', 'esri/PopupTemplate', "esri/renderers/SimpleRenderer"]).then(function (_ref7) {
                var _ref8 = slicedToArray(_ref7, 5),
                    Graphic = _ref8[0],
                    FeatureLayer = _ref8[1],
                    Field = _ref8[2],
                    PopupTemplate = _ref8[3],
                    SimpleRenderer = _ref8[4];
                var symbol = {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: "rgba(224, 206, 69, 0.8)",
                    style: "solid",
                    outline: {
                        color: "red",
                        width: 2
                    }
                };

                var i = 0;
                var graphics = featureCollection.map(function (feature) {

                    feature.attributes["OBJECTID"] = i++;
                    var gfx = Graphic.fromJSON(feature);

                    gfx.symbol = symbol;
                    return gfx;
                });

                var featureLayer = new FeatureLayer({
                    title: filetype + " File: " + layerName,
                    objectIdField: "OBJECTID",
                    //renderer : SimpleRenderer.fromJSON(symbol) ,
                    source: graphics
                    // fields: layer.layerDefinition.fields.map(function (field) {
                    //     return Field.fromJSON(field);
                    // })

                });

                self.state.map.add(featureLayer);
                self.state.view.goTo(graphics);

                var props = {
                    title: filetype + " File: " + layerName,
                    transparency: ".32",
                    identmaxzoom: "13",
                    blockidentselect: true,
                    type: "geojson",
                    src: "",
                    map: self.state.map,
                    view: self.state.view
                };

                var aml = new ArcticMapLayer(props);
                aml.layerRef = featureLayer;
                aml.context = window._map.layers[0].context;
                aml.layerRef.title = props.title;

                self.state.map.amlayers.push(aml);
            });
            return true;
        }
    }, {
        key: "reset",
        value: function reset() {
            this.state.sketchViewModel.cancel();
            this.state.tempGraphicsLayer.removeAll();
            this.setState({ hideEditors: false, geojson: null });
        }
    }, {
        key: "setmaptoselect",
        value: function setmaptoselect() {

            if (this.props.am.state.mode === "select") {
                this.props.am.setMode("view");
                this.setState({ mode: "view" });
            } else {

                this.props.am.setMode("select");
                this.setState({ mode: "select" });
            }
        }
    }, {
        key: "widgetRender",
        value: function widgetRender() {

            var self = this;
            var children = React.Children.map(this.props.children, function (child) {

                return React.cloneElement(child, {
                    map: self.state.map,
                    view: self.state.view,
                    //ref: 'child-' + (index++)
                    hidden: self.state.hideEditors
                });
            });

            if (this.state.hidden === true) {
                return React.createElement("div", { id: "topbar" });
            }

            return React.createElement(
                "div",
                { id: "topbar" },
                this.state.hideEditors === false && React.createElement(
                    "span",
                    null,
                    React.createElement(ArcticMapButton, { showactive: this.props.am.state.mode === "select", esriicon: "cursor", title: "Left click to select / Right click to deselect", onclick: this.setmaptoselect.bind(this) }),
                    this.props.point && React.createElement(ArcticMapButton, { esriicon: "blank-map-pin", onclick: this.addPointClick.bind(this), title: "Draw point" }),
                    this.props.line && React.createElement(ArcticMapButton, { esriicon: "polyline", onclick: this.addLineClick.bind(this), title: "Draw polyline" }),
                    this.props.polygon && React.createElement(ArcticMapButton, { esriicon: "polygon", onclick: this.addPolyClick.bind(this), title: "Draw polygon" }),
                    this.props.square && React.createElement(ArcticMapButton, { esriicon: "checkbox-unchecked", onclick: this.addRecClick.bind(this), title: "Draw rectangle" }),
                    this.props.circle && React.createElement(ArcticMapButton, { esriicon: "radio-unchecked", onclick: this.addCircleClick.bind(this), title: "Draw circle" })
                ),
                children,
                this.props.upload && React.createElement(
                    ArcticMapPanel,
                    { hidden: this.state.hideEditors, esriicon: "upload", title: "Upload GIS file", ref: this.uploadPanel,
                        infoAreaText: this.props.uploadPanelInfoAreaText },
                    React.createElement("br", null),
                    React.createElement(
                        "form",
                        { encType: "multipart/form-data", method: "post", id: "uploadForm" },
                        React.createElement(
                            "div",
                            { className: "field" },
                            React.createElement("br", null),
                            React.createElement(
                                "label",
                                { className: style$2.btm_primary_file },
                                React.createElement("input", { type: "file", name: "file", id: "inFile", onChange: this.fileUploaded.bind(this) }),
                                "Upload File"
                            )
                        )
                    ),
                    React.createElement("br", null),
                    React.createElement("span", { id: "upload-status" })
                ),
                React.createElement(ArcticMapButton, { esriicon: "erase", onclick: this.reset.bind(this), title: "Clear selection" })
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
            return React.createElement(
                "span",
                null,
                this.state.fileLayer
            );
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
                event.stopPropagation();

                self.state.view.hitTest(event).then(function (response) {
                    var results = response.results;
                    // Found a valid graphic
                    if (results.length && results[results.length - 1].graphic && self.map.mode != 'identify') {
                        // Check if we're already editing a graphic
                        // if (!self.state.editGraphic) {
                        // Save a reference to the graphic we intend to update
                        self.state.editGraphic = results[results.length - 1].graphic;
                        // Remove the graphic from the GraphicsLayer
                        // Sketch will handle displaying the graphic while being updated
                        // self.state.tempGraphicsLayer.spatialReference = self.state.editGraphic.geometry.spatialReference;
                        // self.state.view.spatialReference = self.state.editGraphic.geometry.spatialReference;
                        //self.state.tempGraphicsLayer.remove(self.state.editGraphic);
                        self.state.tempGraphicsLayer.graphics = [self.state.editGraphic];
                        //self.state.sketchViewModel.updateGraphics = [self.state.editGraphic];

                        self.state.sketchViewModel.update([self.state.editGraphic]);

                        //self.state.tempGraphicsLayer.graphics = [self.state.editGraphic];

                        //}
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

ArcticMapEdit.displayName = 'ArcticMapEdit';

var css$2 = ".ArcticMapLLDSearch_lldsearchbar__1eLzA {\r\n    background: #fff;\r\n\r\n    vertical-align: top; \r\n  }\r\n\r\n\r\n  .ArcticMapLLDSearch_lldsearchbar__1eLzA div{\r\n    display: inline;\r\n  }";
var style$3 = { "lldsearchbar": "ArcticMapLLDSearch_lldsearchbar__1eLzA" };
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
        key: "componentDidMount",
        value: function componentDidMount() {
            var self = this;
            reactArcgis.loadModules(['esri/Graphic', "esri/geometry/geometryEngine", 'esri/geometry/Geometry', 'esri/geometry/Polygon', "esri/widgets/Search/SearchSource", 'esri/request']).then(function (_ref) {
                var _ref2 = slicedToArray(_ref, 6),
                    Graphic = _ref2[0],
                    geometryEngine = _ref2[1],
                    Geometry = _ref2[2],
                    Polygon = _ref2[3],
                    SearchSource = _ref2[4],
                    esriRequest = _ref2[5];

                //var elestring = this.createElementFromHTML( `<input type="text" placeholder="Find address or place" aria-label="Search" autocomplete="off" tabindex="0" class="esri-input esri-search__input" aria-autocomplete="list" aria-haspopup="true" aria-owns="1687b00a338-widget-1-suggest-menu" role="textbox" data-node-ref="_inputNode" title="Find address or place">`);

                self.top_right_node = document.createElement("div");

                self.Graphic = Graphic;
                self.Geometry = Geometry;
                self.Polygon = Polygon;

                self.state.view.ui.add(self.top_right_node, {
                    position: "top-right",
                    index: 0
                });

                // ReactDOM.render(
                //     self.widgetRender(),
                //     self.top_right_node
                // );


                var url = "https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD";

                self.search = new SearchSource({
                    name: 'Legal Land Description',
                    placeholder: "example: NV 21 T38N R56E SEC 10 ALIQ SESW",

                    getSuggestions: function getSuggestions(p) {
                        var getIT = function getIT(params) {
                            var searchParams = params.suggestTerm.replace(/\+/g, ' ');
                            var searchParts = searchParams.trim().replace(/\s+/g, ' ').split(' ').filter(function (part) {
                                return part != "";
                            });

                            if (searchParts.length > 4) {
                                var options = {
                                    query: {
                                        "legaldescription": searchParams,
                                        "returnalllevels": "true",
                                        f: "pjson"
                                    },
                                    responseType: "json"
                                };
                                return esriRequest(url, options).then(function (results) {

                                    return results.data.features.map(function (feature) {
                                        return {
                                            key: "name",
                                            text: feature.attributes.landdescription,
                                            sourceIndex: params.sourceIndex
                                        };
                                    });
                                });
                            }

                            var PLSSurl = "https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/1/query";

                            //get the states
                            if (!self.suggestionDictionary) {
                                self.suggestionDictionary = {};

                                var queryParams = {
                                    query: {
                                        where: "STATEABBR IS NOT NULL",
                                        outFields: "STATEABBR",
                                        returnGeometry: "false",
                                        returnDistinctValues: "true",
                                        f: "pjson"
                                    },
                                    responseType: "json"
                                };
                                return new Promise(function (res, rej) {
                                    esriRequest(PLSSurl, queryParams).then(function (results) {
                                        results.data.features.map(function (feature) {
                                            self.suggestionDictionary[feature.attributes["STATEABBR"]] = null;
                                        });
                                        return getIT(params);
                                    }).then(function (data) {
                                        res(data);
                                    });
                                });
                            }
                            if (searchParts === null || searchParts.length === 0) {
                                return new Promise(function (res, rej) {
                                    res(Object.keys(self.suggestionDictionary).map(function (state) {
                                        return {
                                            key: "name",
                                            text: state,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }

                            var states = Object.keys(self.suggestionDictionary).filter(function (state) {
                                return state.indexOf(searchParts[0]) >= 0;
                            });
                            if (states.length < 1 || states.length > 1 && searchParts.length > 1) {
                                return new Promise(function (res, rej) {
                                    res([]);
                                });
                            }

                            if (states.length > 1) {
                                return new Promise(function (res, rej) {
                                    res(states.map(function (state) {
                                        return {
                                            key: "name",
                                            text: state,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }

                            //only 1 state get meridians
                            if (!self.suggestionDictionary[states[0]]) {
                                self.suggestionDictionary[states[0]] = {};

                                var queryParams = {
                                    query: {
                                        where: "STATEABBR='" + states[0] + "' AND PRINMERCD IS NOT NULL",
                                        outFields: "PRINMERCD",
                                        returnGeometry: "false",
                                        returnDistinctValues: "true",
                                        f: "pjson"
                                    },
                                    responseType: "json"
                                };

                                return new Promise(function (res, rej) {
                                    esriRequest(PLSSurl, queryParams).then(function (results) {
                                        results.data.features.map(function (feature) {
                                            self.suggestionDictionary[states[0]][feature.attributes["PRINMERCD"]] = null;
                                        });
                                        return getIT(params);
                                    }).then(function (data) {
                                        res(data);
                                    });
                                });
                            }
                            var meridianDict = self.suggestionDictionary[states[0]];
                            if (searchParts.length === 1 && meridianDict.length > 1) {
                                return new Promise(function (res, rej) {
                                    res(Object.keys(meridianDict).map(function (meridian) {
                                        return {
                                            key: "name",
                                            text: states[0] + " " + meridian,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }
                            var meridians = Object.keys(meridianDict);
                            if (searchParts.length > 1) {
                                meridians = Object.keys(meridianDict).filter(function (meridian) {
                                    return meridian.indexOf(searchParts[1]) >= 0;
                                });
                            }
                            if (meridians.length < 1) {
                                return new Promise(function (res, rej) {
                                    res([]);
                                });
                            }
                            if (meridians.length > 1) {
                                return new Promise(function (res, rej) {
                                    res(meridians.map(function (meridian) {
                                        return {
                                            key: "name",
                                            text: states[0] + " " + meridian,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }
                            //only 1 meridian get townships
                            if (!meridianDict[meridians[0]]) {
                                meridianDict[meridians[0]] = {};

                                var queryParams = {
                                    query: {
                                        where: "STATEABBR='" + states[0] + "' AND PRINMERCD='" + meridians[0] + "' AND TWNSHPNO IS NOT NULL AND (TWNSHPDIR='N' OR TWNSHPDIR='S')",
                                        outFields: "TWNSHPNO, TWNSHPDIR",
                                        returnGeometry: "false",
                                        returnDistinctValues: "true",
                                        f: "pjson"
                                    },
                                    responseType: "json"
                                };
                                return new Promise(function (res, rej) {
                                    esriRequest(PLSSurl, queryParams).then(function (results) {
                                        results.data.features.map(function (feature) {
                                            var twp = "T" + feature.attributes["TWNSHPNO"].replace(/^0+/, '') + feature.attributes["TWNSHPDIR"];
                                            meridianDict[meridians[0]][twp] = null;
                                        });
                                        return getIT(params);
                                    }).then(function (data) {
                                        res(data);
                                    });
                                });
                            }
                            var townshipDict = meridianDict[meridians[0]];
                            if (searchParts.length === 2 && townshipDict.length > 1) {
                                return new Promise(function (res, rej) {
                                    res(Object.keys(townshipDict).map(function (township) {
                                        return {
                                            key: "name",
                                            text: states[0] + " " + meridians[0] + " " + township,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }
                            var townships = Object.keys(townshipDict);
                            if (searchParts.length > 2) {
                                townships = Object.keys(townshipDict).filter(function (township) {
                                    return township.indexOf(searchParts[2]) >= 0;
                                });
                            }
                            if (townships.length < 1) {
                                return new Promise(function (res, rej) {
                                    res([]);
                                });
                            }
                            if (townships.length > 1) {
                                return new Promise(function (res, rej) {
                                    res(townships.map(function (township) {
                                        return {
                                            key: "name",
                                            text: states[0] + " " + meridians[0] + " " + township,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }

                            //only 1 township get ranges
                            if (!townshipDict[townships[0]]) {
                                townshipDict[townships[0]] = {};

                                var twpno = townships[0].substring(1, townships[0].length - 1);
                                var twpdir = townships[0].substring(townships[0].length - 1, townships[0].length);

                                var queryParams = {
                                    query: {
                                        where: "STATEABBR='" + states[0] + "' AND PRINMERCD='" + meridians[0] + "' AND (TWNSHPNO='" + twpno + "' OR TWNSHPNO='" + twpno.padStart(3, 0) + "') AND TWNSHPDIR='" + twpdir + "' AND RANGENO IS NOT NULL AND (RANGEDIR='E' OR RANGEDIR='W')",
                                        outFields: "RANGENO, RANGEDIR",
                                        returnGeometry: "false",
                                        returnDistinctValues: "true",
                                        f: "pjson"
                                    },
                                    responseType: "json"
                                };
                                return new Promise(function (res, rej) {
                                    esriRequest(PLSSurl, queryParams).then(function (results) {
                                        results.data.features.map(function (feature) {
                                            var rng = "R" + feature.attributes["RANGENO"].replace(/^0+/, '') + feature.attributes["RANGEDIR"];
                                            townshipDict[townships[0]][rng] = null;
                                        });
                                        return getIT(params);
                                    }).then(function (data) {
                                        res(data);
                                    });
                                });
                            }
                            var rangeDict = townshipDict[townships[0]];
                            if (searchParts.length === 3 && rangeDict.length > 1) {
                                return new Promise(function (res, rej) {
                                    res(Object.keys(rangeDict).map(function (range) {
                                        return {
                                            key: "name",
                                            text: states[0] + " " + meridians[0] + " " + townships[0] + " " + range,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }
                            var ranges = Object.keys(rangeDict);
                            if (searchParts.length > 3) {
                                ranges = Object.keys(rangeDict).filter(function (range) {
                                    return range.indexOf(searchParts[3]) >= 0;
                                });
                            }
                            if (ranges.length < 1) {
                                return new Promise(function (res, rej) {
                                    res([]);
                                });
                            }
                            if (ranges.length > 1) {
                                return new Promise(function (res, rej) {
                                    res(ranges.map(function (range) {
                                        return {
                                            key: "name",
                                            text: states[0] + " " + meridians[0] + " " + townships[0] + " " + range,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }

                            //only 1 range
                            var options = {
                                query: {
                                    "legaldescription": states[0] + " " + meridians[0] + " " + townships[0] + " " + ranges[0],
                                    "returnalllevels": "true",
                                    f: "pjson"
                                },
                                responseType: "json"
                            };
                            return esriRequest(url, options).then(function (results) {
                                return results.data.features.map(function (feature) {
                                    return {
                                        key: "name",
                                        text: feature.attributes.landdescription,
                                        sourceIndex: params.sourceIndex
                                    };
                                });
                            });
                        };

                        return getIT(p).then(function (data) {
                            return data;
                        });
                    },

                    getResults: function getResults(params) {
                        var serarchParams = params.suggestResult.text.replace(/\+/g, ' ');
                        var options = {
                            query: {
                                "legaldescription": serarchParams,
                                "returnalllevels": "true",
                                f: "pjson"
                            },
                            responseType: "json"
                        };

                        return esriRequest(url, options).then(function (results) {

                            var searchResults = results.data.features.map(function (feature) {

                                var outfeature = Graphic.fromJSON(feature);

                                var buffer = geometryEngine.geodesicBuffer(outfeature.geometry, 100, "feet");

                                var searchResult = {
                                    extent: buffer.extent,
                                    feature: outfeature,
                                    name: feature.attributes.landdescription
                                };
                                return searchResult;
                            });
                            return searchResults;
                        });
                    }
                });
            });
        }
    }, {
        key: "searchLLD",
        value: function searchLLD(event) {

            var self = this;

            fetch("https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD?legaldescription=" + this.state.searchinput + "+&returnalllevels=&f=json").then(function (r) {
                return r.json();
            }).then(function (data) {

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
                { className: style$3.lldsearchbar },
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
                ReactDOM.render(this.widgetRender(), this.controlNode, function () {});
            }
        }
    }, {
        key: 'append',
        value: function append(ele) {
            this.props.children.push(ele);
        }
    }, {
        key: 'widgetRender',
        value: function widgetRender() {

            var self = this;

            var children = React.Children.map(this.props.children, function (child) {

                // else if (child.type.name === 'ArcticMapLLDSearch') {

                //   return React.cloneElement(child, {
                //   })

                // } 


                return React.cloneElement(child, {
                    am: self.props.am,
                    map: self.props.am.state.map,
                    view: self.props.am.state.view
                    //hostDiv : self.controlNode
                    //ref: 'child-' + (index++)
                    //ref: (c) => { if (c) { self.childrenElements.push(c); } return 'child-' + (index++) }
                });
            });

            return React.createElement(
                'span',
                { className: 'arcticmap-area' },
                children
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

var ArcticMapIdentify = function (_React$Component) {
  inherits(ArcticMapIdentify, _React$Component);

  function ArcticMapIdentify(props) {
    classCallCheck(this, ArcticMapIdentify);

    var _this = possibleConstructorReturn(this, (ArcticMapIdentify.__proto__ || Object.getPrototypeOf(ArcticMapIdentify)).call(this, props));

    _this.state = { mode: 1 };

    return _this;
  }

  createClass(ArcticMapIdentify, [{
    key: 'setmaptoidentify',
    value: function setmaptoidentify() {
      this.props.am.setMode("identify");
      this.setState({ mode: "identify" });
    }
  }, {
    key: 'render',
    value: function render() {

      //cursor

      return React.createElement(
        'span',
        null,
        React.createElement(ArcticMapButton, { showactive: this.props.am.state.mode === "description", esriicon: 'description', title: 'Information', onclick: this.setmaptoidentify.bind(this) })
      );
    }
  }]);
  return ArcticMapIdentify;
}(React.Component);

ArcticMapIdentify.displayName = 'ArcticMapIdentify';

var ArcticMapBaseControl = function (_React$Component) {
    inherits(ArcticMapBaseControl, _React$Component);

    function ArcticMapBaseControl(props) {
        classCallCheck(this, ArcticMapBaseControl);

        var _this = possibleConstructorReturn(this, (ArcticMapBaseControl.__proto__ || Object.getPrototypeOf(ArcticMapBaseControl)).call(this, props));

        _this.canShowAttributeTable = function (layerUrl) {
            if (_this.props.attributesTableLayers && _this.props.attributesTableLayers.length > 0) {
                return _this.props.attributesTableLayers.some(function (lyr) {
                    return lyr.url === layerUrl;
                });
            }
            return false;
        };

        _this.getAttributeTableLayerFields = function (layerUrl) {
            if (_this.props.attributesTableLayers && _this.props.attributesTableLayers.length > 0) {
                var layer = _this.props.attributesTableLayers.find(function (lyr) {
                    return lyr.url === layerUrl;
                });
                if (layer && layer.fields && layer.fields.length > 0) {
                    return layer.fields;
                }
            }
            return [];
        };

        _this.getAttributeTableLayerHiddenFields = function (layerUrl) {
            if (_this.props.attributesTableLayers && _this.props.attributesTableLayers.length > 0) {
                var layer = _this.props.attributesTableLayers.find(function (lyr) {
                    return lyr.url === layerUrl;
                });
                if (layer && layer.hiddenFields && layer.hiddenFields.length > 0) {
                    return layer.hiddenFields;
                }
            }
            return [];
        };

        _this.watchForLegendChanges = function (legend) {
            legend.watch('activeLayerInfos.length', function (len) {
                _this.removeLegendDuplicateLabels();
            });
            legend.view.watch('stationary', function (stationary) {
                if (stationary) {
                    _this.removeLegendDuplicateLabels();
                }
            });
            legend.view.map.layers.on("after-changes", function (event) {
                legend.view.map.layers.forEach(function (layer) {
                    if (layer.allSublayers) {
                        layer.allSublayers.forEach(function (subLayer) {
                            subLayer.watch('visible', function (visible) {
                                _this.removeLegendDuplicateLabels();
                            });
                        });
                    }
                    layer.watch('visible', function (visible) {
                        _this.removeLegendDuplicateLabels();
                    });
                });
            });
        };

        _this.watchForLayerListChanges = function (layerList) {
            layerList.view.map.layers.on("after-changes", function (event) {
                var viewModel = layerList.viewModel;
            });
        };

        _this.removeLegendDuplicateLabels = function () {
            setTimeout(function () {
                var elements = document.getElementsByClassName("esri-legend__layer-body");
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].childNodes && elements[i].childNodes.length > 2) {
                        var element = elements[i];
                        var label = "";
                        for (var _i = 0; _i < element.childNodes.length; _i++) {
                            var childNodeI = element.childNodes[_i];
                            for (var k = _i + 1; k < element.childNodes.length; k++) {
                                var childNodeK = element.childNodes[k];
                                if (element.childNodes[_i].innerText == element.childNodes[k].innerText) {
                                    childNodeK.classList.add("arctic-map-hidden");
                                }
                            }
                        }
                        for (var index = 0; index < element.childNodes.length; index++) {
                            var childNode = element.childNodes[index];
                            if (childNode.childNodes.length === 2) {
                                var innerText = childNode.childNodes[1].innerText;
                                if (innerText && innerText === label && innerText !== '\t') {
                                    if (!childNode.classList.contains("arctic-map-hidden")) {
                                        childNode.classList.add("arctic-map-hidden");
                                    }
                                }
                                label = innerText;
                            }
                        }
                    }
                }
            }, 2000);
        };

        _this.state = {
            zoomControl: null,
            renderElements: [],
            canReset: _this.props.reset !== undefined

        };
        var self = _this;
        _this.zoomControlDiv = document.createElement("div");
        _this.layersDiv = document.createElement("div");
        _this.legendDiv = document.createElement("div");

        reactArcgis.loadModules(['esri/widgets/Zoom', 'esri/widgets/LayerList', 'esri/widgets/Legend', 'esri/widgets/BasemapGallery']).then(function (_ref) {
            var _ref2 = slicedToArray(_ref, 4),
                Zoom = _ref2[0],
                LayerList = _ref2[1],
                Legend = _ref2[2],
                BasemapGallery = _ref2[3];

            self.props.view.on('click', function (event) {

                self.props.view.ui.remove(self.basemapGallery);
            });

            self.basemapGallery = new BasemapGallery({
                view: props.view
            });
            self.basemapGallery.watch('activeBasemap', function (newValue, oldValue, property, object) {
                self.props.view.ui.remove(self.basemapGallery);
            });

            var zoom = new Zoom({
                view: props.view,
                container: self.zoomControlDiv,
                position: "top-left"
            });
            self.state.zoomControl = zoom;

            //this.props.hostDiv.appendChild(zoom);
            //props.view.ui.add(zoom, props.hostDiv);
            //self.state.children.push(self.zoomControlDiv);

            var legend = new Legend({
                view: props.view,
                container: self.legendDiv
            });

            _this.watchForLegendChanges(legend);

            var layerList = new LayerList({
                view: props.view,
                container: self.layersDiv,
                listItemCreatedFunction: function listItemCreatedFunction(event) {
                    // only legend if imageFormat exist in TOC
                    var actions = [{
                        title: "Labels on/off",
                        className: "esri-icon-checkbox-checked",
                        id: "toggle-labels"
                    }, {
                        title: "Increase opacity",
                        className: "esri-icon-up",
                        id: "increase-opacity"
                    }, {
                        title: "Decrease opacity",
                        className: "esri-icon-down",
                        id: "decrease-opacity"
                    }];

                    var item = event.item;
                    if (item.layer.imageFormat) {
                        //const item = event.item
                        item.panel = {
                            content: 'legend',
                            open: false
                        };
                        item.panel.watch('open', function (isOpen) {
                            self.removeLegendDuplicateLabels();
                        });
                    } else {
                        if (self.canShowAttributeTable(item.layer.url)) {
                            actions.unshift({
                                title: "Open Attribute Table",
                                className: "esri-icon-table",
                                id: "open-attribute-table"
                            });
                            //actions.unshift({
                            //    title: "Open Map Service",
                            //    className: "esri-icon-launch-link-external",
                            //    id: "open-map-service"
                            //});
                        }
                    }

                    item.actionsSections = [actions];
                }
            });
            layerList.selectionEnabled = true;
            _this.watchForLayerListChanges(layerList);

            layerList.on("trigger-action", function (event) {
                if (event.action.id === "toggle-labels") {
                    if (event.action.className === "esri-icon-checkbox-unchecked") {
                        event.action.className = "esri-icon-checkbox-checked";
                        event.item.layer.labelsVisible = true;
                    } else {
                        event.action.className = "esri-icon-checkbox-unchecked";
                        event.item.layer.labelsVisible = false;
                    }
                    //console.log(event);
                }
                if (event.action.id === "increase-opacity") {
                    event.item.layer.opacity += 0.1;
                    event.item.layer.opacity >= 1 ? event.item.layer.opacity = 1 : event.item.layer.opacity;
                }
                if (event.action.id === "decrease-opacity") {
                    event.item.layer.opacity -= 0.1;
                    event.item.layer.opacity <= 0 ? event.item.layer.opacity = 0 : event.item.layer.opacity;
                }
                if (event.action.id === "open-attribute-table") {
                    self.props.openAttributesTable({
                        view: self.props.view,
                        url: event.item.layer.url,
                        title: event.item.layer.title,
                        fields: self.getAttributeTableLayerFields(event.item.layer.url),
                        hiddenFields: self.getAttributeTableLayerHiddenFields(event.item.layer.url)
                    });
                }
                if (event.action.id === "open-map-service") {
                    self.props.openMapService({
                        url: event.item.layer.url
                    });
                }
            });
            //self.state.view.ui.add(layerList, 'top-left')
            //var joined = self.state.renderElements.concat(self.zoomControlDiv);
            _this.setState({ renderElements: self.state.renderElements.concat(self.zoomControlDiv) });
        });

        return _this;
    }

    createClass(ArcticMapBaseControl, [{
        key: 'handleShowBasemaps',
        value: function handleShowBasemaps() {}
    }, {
        key: 'renderZoomcontrol',
        value: function renderZoomcontrol() {

            return this.zoomControlDiv;
        }
    }, {
        key: 'basemapclick',
        value: function basemapclick() {
            this.props.view.ui.add(this.basemapGallery, {
                position: 'bottom-right'
            });
            //this.setState({ hideBasemapButton: true })
            // self.state.view.ui.remove(self.basemapGallery);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                null,
                React.createElement(
                    ArcticMapControlArea,
                    { am: this.props.am, view: this.props.view, location: 'top-left' },
                    React.createElement('div', { ref: function ref(e) {
                            e && e.appendChild(_this2.zoomControlDiv);
                        } })
                ),
                React.createElement(
                    ArcticMapControlArea,
                    { am: this.props.am, view: this.props.view, location: 'bottom-right', className: styles.ArcticMap },
                    React.createElement(
                        ArcticMapPanel,
                        { esriicon: 'layer-list', title: 'Legend', ontoggle: this.removeLegendDuplicateLabels.bind(this) },
                        React.createElement('div', { ref: function ref(e) {
                                e && e.appendChild(_this2.legendDiv);
                            } })
                    ),
                    React.createElement(
                        ArcticMapPanel,
                        { esriicon: 'collection', title: 'Layers' },
                        React.createElement(
                            'p',
                            null,
                            'Toggle visibility of each data layer.'
                        ),
                        React.createElement(
                            'p',
                            null,
                            'Click, drag and drop layers to reorder.'
                        ),
                        this.state.canReset && React.createElement(
                            'p',
                            null,
                            React.createElement(
                                'a',
                                { href: '#', style: { color: '#71A3AF', textDecoration: 'none' }, onClick: this.props.reset },
                                React.createElement('span', { style: { height: "10px", width: "10px", marginRight: '10px', color: 'black' }, 'aria-hidden': true, className: 'esri-icon esri-icon-trash' }),
                                'Reset to Default Data Visibility'
                            )
                        ),
                        React.createElement('div', { ref: function ref(e) {
                                e && e.appendChild(_this2.layersDiv);
                            } })
                    ),
                    React.createElement(ArcticMapButton, { esriicon: 'basemap', title: 'Basemaps', onclick: this.basemapclick.bind(this) })
                )
            );
        }
    }]);
    return ArcticMapBaseControl;
}(React.Component);

ArcticMapBaseControl.displayName = "ArcticMapBaseControl";

var ArcticMapLayerRenderer = function (_React$Component) {
    inherits(ArcticMapLayerRenderer, _React$Component);

    function ArcticMapLayerRenderer(props) {
        classCallCheck(this, ArcticMapLayerRenderer);

        var _this = possibleConstructorReturn(this, (ArcticMapLayerRenderer.__proto__ || Object.getPrototypeOf(ArcticMapLayerRenderer)).call(this, props));

        if (props.style === undefined) {
            console.log("Missing style: Build Styles @ https://developers.arcgis.com/javascript/latest/sample-code/playground/live/index.html");
        }

        return _this;
    }

    createClass(ArcticMapLayerRenderer, [{
        key: 'render',
        value: function render() {
            return React.createElement('span', null);
        }
    }]);
    return ArcticMapLayerRenderer;
}(React.Component);

ArcticMapLayerRenderer.displayName = 'ArcticMapLayerRenderer';

var ArcticMapLocator = function (_React$Component) {
    inherits(ArcticMapLocator, _React$Component);

    function ArcticMapLocator(props) {
        classCallCheck(this, ArcticMapLocator);
        return possibleConstructorReturn(this, (ArcticMapLocator.__proto__ || Object.getPrototypeOf(ArcticMapLocator)).call(this, props));
    }

    createClass(ArcticMapLocator, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var self = this;
            reactArcgis.loadModules(['esri/widgets/Locate', 'esri/widgets/BasemapGallery', 'esri/widgets/Home', 'esri/widgets/Search', 'esri/layers/FeatureLayer', 'esri/tasks/Locator', 'esri/geometry/geometryEngine', "esri/request"]).then(function (_ref) {
                var _ref2 = slicedToArray(_ref, 8),
                    Locate = _ref2[0],
                    BasemapGallery = _ref2[1],
                    Home = _ref2[2],
                    Search = _ref2[3],
                    FeatureLayer = _ref2[4],
                    Locator = _ref2[5],
                    geometryEngine = _ref2[6],
                    Request = _ref2[7];

                var searchsources = [];

                var devaultSource = {
                    locator: new Locator({ url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
                    singleLineFieldName: "SingleLine",
                    name: "Standard Geocoder",
                    placeholder: "Find address",
                    maxResults: 3,
                    maxSuggestions: 6,
                    suggestionsEnabled: true,
                    minSuggestCharacters: 0
                };
                searchsources.push(devaultSource);
                var searchitems = self.props.am.childrenElements.filter(function (ele) {

                    if (ele.search) {
                        return ele;
                    }
                    // if (ele.constructor.name.toLowerCase().includes('search')) {
                    //   return ele;
                    // }
                });

                var lldsSarchsources = searchitems.map(function (i) {
                    if (i.search) {
                        return i.search;
                    }
                });

                searchsources.push(lldsSarchsources[0]);

                if (self.props.searchSources) {
                    self.props.searchSources.map(function (searchSource) {

                        var searchFeature = new FeatureLayer({
                            url: searchSource.scr + searchSource.layerid
                        });
                        searchSource.layer = searchFeature;

                        searchsources.push(searchSource);
                    });
                }

                var locationServicesEnabled = true;
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
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }]);
    return ArcticMapLocator;
}(React.Component);

ArcticMapLocator.displayName = "ArcticMapLocator";

var css$3 = "#ArcticMapDatagrid_viewDiv__1jVm4 {\r\n    padding: 0;\r\n    margin: 0;\r\n    height: 100%;\r\n    width: 100%;\r\n    overflow: hidden;\r\n}\r\n\r\n#ArcticMapDatagrid_viewDiv__1jVm4.ArcticMapDatagrid_withGrid__2pcIo {\r\n    height: 65%;\r\n}\r\n\r\n.ArcticMapDatagrid_esri-widget__11J-n {\r\n    padding-left: 8px;\r\n    padding-right: 4px;\r\n}\r\n\r\n#ArcticMapDatagrid_paneDiv__4JrPe {\r\n    position: absolute;\r\n    top: 10px;\r\n    left: 62px;\r\n    padding: 0 12px 0 12px;\r\n    background-color: rgba(0, 0, 0, 0.5);\r\n    color: white;\r\n}\r\n\r\n#ArcticMapDatagrid_gridDisplay__vEVRf {\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    height: 35%;\r\n    background-color: white;\r\n    border-color: grey;\r\n    width: 100%;\r\n    font-family: \"Avenir Next W00\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n    font-size: 14px;\r\n    display: none;\r\n}\r\n\r\n#ArcticMapDatagrid_gridDisplay__vEVRf {\r\n    z-index: 80;\r\n}\r\n\r\n.ArcticMapDatagrid_info__25AFm {\r\n    line-height: 20px;\r\n    padding-left: 5px ! important;\r\n}\r\n\r\n.ArcticMapDatagrid_dgrid-header__3-6Tw,\r\n.ArcticMapDatagrid_dgrid-header-row__14P71 {\r\n    background-color: #eee;\r\n    color: #57585A;\r\n}\r\n\r\n.ArcticMapDatagrid_dgrid-row-even__ddnvo {\r\n    background-color: #F7F8F8;\r\n}\r\n\r\n.ArcticMapDatagrid_dgrid-row-odd__3ccqR {\r\n    background-color: #EFEFEF;\r\n}\r\n\r\n.ArcticMapDatagrid_dgrid-selected__3QJlO {\r\n    background: #B4DAF5;\r\n}\r\n\r\n.ArcticMapDatagrid_dgrid-row__2ZNee {\r\n    border: none\r\n}\r\n\r\n.ArcticMapDatagrid_gridcontainer__2X2Yx {\r\n    max-height: 21em;\r\n}\r\n\r\n";
var styles$2 = { "viewDiv": "ArcticMapDatagrid_viewDiv__1jVm4", "withGrid": "ArcticMapDatagrid_withGrid__2pcIo", "esri-widget": "ArcticMapDatagrid_esri-widget__11J-n", "paneDiv": "ArcticMapDatagrid_paneDiv__4JrPe", "gridDisplay": "ArcticMapDatagrid_gridDisplay__vEVRf", "info": "ArcticMapDatagrid_info__25AFm", "dgrid-header": "ArcticMapDatagrid_dgrid-header__3-6Tw", "dgrid-header-row": "ArcticMapDatagrid_dgrid-header-row__14P71", "dgrid-row-even": "ArcticMapDatagrid_dgrid-row-even__ddnvo", "dgrid-row-odd": "ArcticMapDatagrid_dgrid-row-odd__3ccqR", "dgrid-selected": "ArcticMapDatagrid_dgrid-selected__3QJlO", "dgrid-row": "ArcticMapDatagrid_dgrid-row__2ZNee", "gridcontainer": "ArcticMapDatagrid_gridcontainer__2X2Yx" };
styleInject(css$3);

var ArcticMapDatagrid = function (_React$Component) {
  inherits(ArcticMapDatagrid, _React$Component);

  function ArcticMapDatagrid(props) {
    classCallCheck(this, ArcticMapDatagrid);

    var _this = possibleConstructorReturn(this, (ArcticMapDatagrid.__proto__ || Object.getPrototypeOf(ArcticMapDatagrid)).call(this, props));

    _this.state = "review";
    console.log("ArcticMapDatagrid constructor ", _this);

    // const drawBox = props.view.on('drag', (event) => {
    //     console.log("view drag");
    //     this.drawTempGraphic(this.props.view, event);
    //     event.stopPropagation();
    // })
    return _this;
  }

  createClass(ArcticMapDatagrid, [{
    key: '_getPrintLayout',
    value: function _getPrintLayout() {
      console.log("gridclick *****");
    }
  }, {
    key: 'onRowClickHandler',
    value: function onRowClickHandler(event) {
      console.log("onRowClickHandler", event.rows[0].data);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      console.log("componentDidMount  *****", this);
      reactArcgis.loadModules(["dgrid/Grid", "dgrid/Selection", 'dojo/_base/declare', 'esri/layers/FeatureLayer', 'dojo/on']).then(function (_ref) {
        var _ref2 = slicedToArray(_ref, 5),
            Grid = _ref2[0],
            Selection = _ref2[1],
            declare = _ref2[2],
            FeatureLayer = _ref2[3],
            on = _ref2[4];

        var myGrid = declare([Grid, Selection]);
        var self = _this2;
        var caseFeatureLayer = new FeatureLayer({
          url: self.props.src,
          outFields: ["*"],
          visible: false
        });
        var query = caseFeatureLayer.createQuery();
        query.where = "1=1";
        query.outFields = self.props.outFields; // [ "CSE_NR", "BLM_PROD", "CSE_TYPE_NR", "LEG_CSE_NR", "STATUS","SRC", "CSE_META", "RCRD_ACRS", "GIS_ACRS", "PLSSIDS", "CMMDTY", "FRMTN", "EDOA", "PRDCNG", "OPRTR"];
        caseFeatureLayer.queryFeatures(query).then(function (response) {

          var featureColumns = response.fields.map(function (outField) {
            var newColumn = {
              'field': outField.name,
              'label': outField.alias };
            return newColumn;
          });

          var items = response.features.map(function (feature) {
            return feature.attributes;
          });
          var grid = new myGrid({
            columns: featureColumns,
            selectionMode: 'single'
          }, "arcticmapdatagrid");

          grid.renderArray(items);

          grid.on("dgrid-select", self.onRowClickHandler);
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {

      return React.createElement('div', { id: 'arcticmapdatagrid', className: styles$2.gridcontainer });
    }
  }]);
  return ArcticMapDatagrid;
}(React.Component);

ArcticMapDatagrid.displayName = "ArcticMapDatagrid";

var styles$3 = {
    rightWidgetFull: {
        "position": "absolute",
        "left": "20px",
        "top": "410px",
        "bottom": "2px",
        "zIndex": "100",

        "minWidth": '95%',
        "paddingTop": '10px'
    },
    widgetContainer: {
        "position": 'realative',
        "paddingRight": "10px",
        "paddingLeft": "10px",
        "paddingBottom": "50px",

        "overflowY": 'auto',
        "maxHeight": '100%'
    }

};

var ArcticMapDGridPanel = function (_React$Component) {
    inherits(ArcticMapDGridPanel, _React$Component);

    function ArcticMapDGridPanel(props) {
        classCallCheck(this, ArcticMapDGridPanel);

        var _this = possibleConstructorReturn(this, (ArcticMapDGridPanel.__proto__ || Object.getPrototypeOf(ArcticMapDGridPanel)).call(this, props));

        _this.toggle = function () {

            var currvalue = this.state.open;
            this.setState({ open: !currvalue });
        };
        _this.toggle = _this.toggle.bind(_this);

        _this.mapFrame = document.getElementsByClassName('esri-view-root')[0];
        _this.renderEle = document.createElement("span");
        _this.mapFrame.appendChild(_this.renderEle);
        _this.state = {
            hidden: !_this.props.hidden ? false : true,
            open: _this.props.open || false
        };

        if (props.map) {
            _this.map = props.map;
        }
        if (props.view) {
            _this.view = props.view;
            _this.view.on('click', function (e) {
                _this.setState({ open: false });
            });
        }

        return _this;
    }

    createClass(ArcticMapDGridPanel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {

            // console.log(self.props);
            // self.props.view.on('click', (event) => {

            //     self.setState({ open: false });

            // });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.renderPanel();
        }
    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'span',
                { visibility: this.state.hidden },
                React.createElement(ArcticMapButton, { padtop: this.props.padtop, padbottom: this.props.padbottom, esriicon: this.props.esriicon, onclick: this.toggle.bind(this), title: this.props.title })
            );
        }
    }, {
        key: 'renderPanel',
        value: function renderPanel() {
            // refactor this
            if (this.state.open) {
                var ele = React.createElement('div', { className: 'esri-widget', style: styles$3.rightWidgetFull }, React.createElement('h2', { style: { "paddingLeft": "20px", marginTop: '6px', fontSize: '15px', marginBottom: '10px' } }, this.props.title), React.createElement('span', { style: { position: 'absolute', top: '20px', right: '20px' } }, React.createElement('button', {
                    onClick: this.toggle,
                    title: 'Close',
                    style: { border: 'none', background: 'transparent', cursor: 'pointer' }
                }, React.createElement('span', {
                    style: { fontSize: '15px' },
                    'aria-hidden': true,
                    className: 'esri-icon esri-icon-close'
                }))
                //React.createElement(ArcticMapButton, { esriicon: 'close', onclick: this.toggle, style : { fontSize : '28px'} })
                ), React.createElement('div', { style: styles$3.widgetContainer }, React.createElement('div', null, this.props.children)));

                // <button style={style.arcticButton} onClick={this.fireclick.bind(this)} title={this.props.title} >
                //     <span style={{ height: "15px", width: "15px" }} aria-hidden className={esriClassName} ></span>
                // </button>

                ReactDOM.render(ele, this.renderEle);
            } else {
                var eleempty = React.createElement('span', null);
                ReactDOM.render(eleempty, this.renderEle);
            }
        }
    }]);
    return ArcticMapDGridPanel;
}(React.Component);

ArcticMapDGridPanel.displayName = 'ArcticMapDGriPanel';

exports.ArcticMap = ArcticMap;
exports.ArcticMapEdit = ArcticMapEdit;
exports.ArcticMapLayer = ArcticMapLayer;
exports.ArcticMapLLDSearch = ArcticMapLLDSearch;
exports.ArcticMapLayerPopup = ArcticMapLayerPopup;
exports.ArcticMapControlArea = ArcticMapControlArea;
exports.ArcticMapButton = ArcticMapButton;
exports.ArcticMapPanel = ArcticMapPanel;
exports.ArcticMapIdentify = ArcticMapIdentify;
exports.ArcticMapBaseControl = ArcticMapBaseControl;
exports.ArcticMapLayerRenderer = ArcticMapLayerRenderer;
exports.ArcticMapLocator = ArcticMapLocator;
exports.ArcticMapDatagrid = ArcticMapDatagrid;
exports.ArcticMapDGridPanel = ArcticMapDGridPanel;
//# sourceMappingURL=ArcticMap.js.map
