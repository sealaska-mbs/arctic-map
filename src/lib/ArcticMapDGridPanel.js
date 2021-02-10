import React from 'react';
import ReactDOM from "react-dom";
import ArcticMapButton from './ArcticMapButton';

var styles = {
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

class ArcticMapDGridPanel extends React.Component {
    static displayName = 'ArcticMapDGriPanel';
    constructor(props) {
        super(props)

        this.toggle = function () {

            var currvalue = this.state.open;
            this.setState({ open: !currvalue });
        };
        this.toggle = this.toggle.bind(this);

        this.mapFrame = document.getElementsByClassName('esri-view-root')[0];
        this.renderEle = document.createElement("span");
        this.mapFrame.appendChild(this.renderEle);
        this.state = {
            hidden: !this.props.hidden ? false : true,
            open: this.props.open || false
        };
     
        if(props.map){
            this.map = props.map;
        }
        if(props.view){
            this.view = props.view;
            this.view.on('click', (e) => {
                this.setState({ open: false });
            });
        }


    }

    componentDidMount() {
        var self = this;
        
        // console.log(self.props);
        // self.props.view.on('click', (event) => {

        //     self.setState({ open: false });

        // });
    }

    componentDidUpdate() {
        this.renderPanel();
    }

    render() {

        return (<span visibility={this.state.hidden}><ArcticMapButton padtop={this.props.padtop} padbottom={this.props.padbottom} esriicon={this.props.esriicon} onclick={this.toggle.bind(this)} title={this.props.title} ></ArcticMapButton></span>);
    }
    renderPanel() {
        // refactor this
        if (this.state.open) {
            var ele = React.createElement(
                'div',
                { className: 'esri-widget', style: styles.rightWidgetFull },
                React.createElement(
                    'h2',
                    { style: { "paddingLeft": "20px", marginTop: '6px',  fontSize: '15px', marginBottom : '10px' } },
                    this.props.title
                ),
                React.createElement(
                    'span',
                    { style: { position: 'absolute', top: '20px', right: '20px' } },
                    React.createElement(
                        'button',
                        {
                            onClick : this.toggle,
                            title : 'Close',
                            style : { border : 'none', background : 'transparent', cursor : 'pointer'}
                        },
                        React.createElement(
                            'span',
                            {
                               style : { fontSize: '15px' },
                               'aria-hidden' : true,
                               className : 'esri-icon esri-icon-close'
                            },
                            
                        )
                    )
                    //React.createElement(ArcticMapButton, { esriicon: 'close', onclick: this.toggle, style : { fontSize : '28px'} })
                ),
                React.createElement(
                    'div',
                    { style: styles.widgetContainer },
                    React.createElement(
                        'div',
                        null,
                        this.props.children
                    )
                )
            );

            // <button style={style.arcticButton} onClick={this.fireclick.bind(this)} title={this.props.title} >
            //     <span style={{ height: "15px", width: "15px" }} aria-hidden className={esriClassName} ></span>
            // </button>

            ReactDOM.render(ele, this.renderEle);
        } else {
            var eleempty = React.createElement('span', null);
            ReactDOM.render(eleempty, this.renderEle);
        }
    }

}

export default ArcticMapDGridPanel