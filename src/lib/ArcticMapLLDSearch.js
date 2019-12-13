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


            'esri/geometry/Geometry',
            'esri/geometry/Polygon',
            "esri/widgets/Search/SearchSource",

        ]).then(([
            Graphic,


            Geometry,
            Polygon,
            SearchSource,

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


            var url = "https://api-adresse.data.gouv.fr/";

            self.search = () => {
                return new SearchSource({
                    name: 'Legal Land Description',
                    placeholder: "example: NV 21 T38N R56E SEC 10 ALIQ SESW",
                   
                    getSuggestions: function (params) {
                 

                        return fetch(`https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD?legaldescription=${params.suggestTerm.replace(/ /g, "+")}+&returnalllevels=&f=json`).then(r => r.json()).then(data => {
                       
                            return data.features.map(function (feature) {
                                return {
                                    key: "name",
                                    text: feature.attributes.landdescription,
                                    sourceIndex: params.sourceIndex
                                };
                            });
                        });


                    },
                
                    getResults: function (params) {
                     


                        return fetch(`https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/FindLD?legaldescription=${params.suggestResult.text.replace(/ /g, "+")}+&returnalllevels=&f=json`).then(r => r.json()).then(data => {
                        
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
            }


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