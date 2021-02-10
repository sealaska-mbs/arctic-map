// WY060140N0660W0SN180ANENE


import React from "react";
import ReactDOM from "react-dom";

import style from './ArcticMapLLDSearch.css';

import {
    loadModules
} from 'react-arcgis';

class ArcticMapLLDSearch extends React.Component {
static displayName = 'ArcticMapLLDSearch';
    constructor(props) {
        super(props);

        this.state = {
            map: props.map,
            view: props.view,
            graphic: null
        };

        this.handleChange = this.handleChange.bind(this);
    }





    componentDidMount() {
        var self = this;
        loadModules(['esri/Graphic',
            "esri/geometry/geometryEngine",
            'esri/geometry/Geometry',
            'esri/geometry/Polygon',
            "esri/widgets/Search/SearchSource",
            'esri/request'

        ]).then(([
            Graphic,
            geometryEngine,
            Geometry,
            Polygon,
            SearchSource,
            esriRequest

        ]) => {


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



            var url = "https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD"

            self.search = new SearchSource({
                    name: 'Legal Land Description',
                    placeholder: "example: NV 21 T38N R56E SEC 10 ALIQ SESW",
                   
                    getSuggestions: function (p) {
                        self.search.autoNavigate = false;
                        let getIT = function (params) {
                            var searchParams = params.suggestTerm.replace(/\+/g, ' ');
                            var searchParts = searchParams.trim().replace(/\s+/g, ' ').split(' ').filter((part) => part!="" );
    
                            if (searchParts.length > 4) {
                                var options = {
                                    query: {
                                        "legaldescription": searchParams,
                                        "returnalllevels": "true",
                                        f: "pjson"
                                    },
                                    responseType: "json"
                                }
                                self.search.autoNavigate = true;
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
                                return new Promise((res, rej) => {
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
                                return new Promise((res, rej) => {
                                    res(Object.keys(self.suggestionDictionary).map(function (state) {
                                        return {
                                            key: "name",
                                            text: state,
                                            sourceIndex: params.sourceIndex
                                        };
                                    }));
                                });
                            }
    
                            var states = Object.keys(self.suggestionDictionary).filter((state) => state.indexOf(searchParts[0]) >= 0);
                            if (states.length < 1 || (states.length > 1 && searchParts.length > 1)) {
                                return new Promise((res, rej) => {
                                    res([]);
                                });
                            }
    
                            if (states.length > 1) {
                                return new Promise((res, rej) => {
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
    
                                return new Promise((res, rej) => {
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
                                return new Promise((res, rej) => {
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
                                meridians = Object.keys(meridianDict).filter((meridian) => meridian.indexOf(searchParts[1]) >= 0);
                            }
                            if (meridians.length < 1) {
                                return new Promise((res, rej) => {
                                    res([]);
                                });
                            }
                            if (meridians.length > 1) {
                                return new Promise((res, rej) => {
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
                                return new Promise((res, rej) => {
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
                                return new Promise((res, rej) => {
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
                                townships = Object.keys(townshipDict).filter((township) => township.indexOf(searchParts[2]) >= 0);
                            }
                            if (townships.length < 1) {
                                return new Promise((res, rej) => {
                                    res([]);
                                });
                            }
                            if (townships.length > 1) {
                                return new Promise((res, rej) => {
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
                                var twpdir = townships[0].substring(townships[0].length - 1, townships[0].length)
    
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
                                return new Promise((res, rej) => {
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
                            self.search.autoNavigate = true;
                            var rangeDict = townshipDict[townships[0]];
                            if (searchParts.length === 3 && rangeDict.length > 1) {
                                return new Promise((res, rej) => {
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
                                ranges = Object.keys(rangeDict).filter((range) => range.indexOf(searchParts[3]) >= 0);
                            }
                            if (ranges.length < 1) {
                                return new Promise((res, rej) => {
                                    res([]);
                                });
                            }
                            if (ranges.length > 1) {
                                return new Promise((res, rej) => {
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
                            }
                            return esriRequest(url, options).then(function (results) {
                                self.search.autoNavigate = true;
                                return results.data.features.map(function (feature) {
                                    return {
                                        key: "name",
                                        text: feature.attributes.landdescription,
                                        sourceIndex: params.sourceIndex
                                    };
                                });
                            });
                        };
    
                        return getIT(p).then((data) => data);

                    },
                
                    getResults: function (params) {
                        var serarchParams = params.suggestResult.text.replace(/\+/g,' ');
                        var options = {
                            query :{
                                "legaldescription": serarchParams,
                                "returnalllevels": "true",
                                f:"pjson"
                            },
                            responseType: "json"
                        }

                        return esriRequest(url, options).then(function(results) {
                        
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

    searchLLD(event) {

        var self = this;

        fetch(`https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD?legaldescription=${this.state.searchinput}+&returnalllevels=&f=json`).then(r => r.json()).then(data => {
   


            var popupresults = data.features.map(function (feature) {

                feature.geometry = self.Polygon.fromJSON(feature.geometry);

                feature = new self.Graphic(feature);


                var displayValue = feature.attributes.landdescription;


                feature.popupTemplate = { // autocasts as new PopupTemplate()
                    title: 'Legal Land Description',
                    content: `<b>LLD</b>: ${displayValue}`,
                    actions: [{ title: "Select", id: "select-action" }]
                }



                return feature
            })

            if (popupresults.length > 0) {
                self.state.view.popup.open({
                    features: popupresults,
                    location: event.mapPoint
                })




            }


        })

    }

    handleChange(event) {
        this.setState({ searchinput: event.target.value });
    }

    widgetRender() {
        return <div className={style.lldsearchbar}>


            <div style={{ display: 'inline-block', height: '32px', marginTop: '0px' }}  >


                <input style={{ display: 'inline-block', height: '32px', verticalAlign: 'top' }} value={this.state.searchinput} onChange={this.handleChange} type="text" placeholder="Find legal land description" aria-label="Search" className="esri-input" title="Find leagal land desription" />

                <div style={{ display: 'inline-block', width: '32px', height: '32px', verticalAlign: 'top' }} role="button" title="Search" className="esri-search__submit-button esri-widget--button" onClick={this.searchLLD.bind(this)}>
                    <span style={{ display: 'block', paddingTop: '8px' }} aria-hidden="true" role="presentation" className="esri-icon-search"></span>

                </div>
            </div>



        </div>;
    }


    render() {
        return null;
    }




}

export default ArcticMapLLDSearch;