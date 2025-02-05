import React from 'react';
import { createRoot } from 'react-dom/client';
import ArcticMapButton from './ArcticMapButton';

var styles = {
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

class ArcticMapPanel extends React.Component {
    static displayName = 'ArcticMapPanel';
    constructor(props) {
        super(props)

        this.toggle = function () {

            var currvalue = this.state.open;
            this.setState({ open: !currvalue });

            if (this.props.ontoggle) {
                this.props.ontoggle();
            }
        };
        this.toggle = this.toggle.bind(this);
        

        this.mapFrame = document.getElementsByClassName('esri-view-root')[0];
        this.renderEle = document.createElement("span");
        this.mapFrame.appendChild(this.renderEle);
        this.state = {
            hidden: !this.props.hidden ? false : true,
            open: this.props.open || false
        };
        this.root = createRoot(this.renderEle);

        ArcticMapPanel.defaultProps= {
            infoAreaText: ""
        }
     
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
                    { style: { "paddingLeft": "20px", marginTop: '6px',  fontSize: '28px', marginBottom : '10px' } },
                    this.props.title
                ),
                React.createElement(
                    'div',
                    { style: { position: 'absolute', top: '20px', right: '20px' } },

                    React.createElement(
                        'button',
                        {
                            onClick : this.toggle,
                            title : 'Close',
                            style : { border : 'none', background : 'transparent', cursor : 'pointer'},
                            autoFocus : true
                        },
                        React.createElement(
                            'span',
                            {
                               style : { fontSize: '28px' },
                               'aria-hidden' : true,
                               className : 'esri-icon esri-icon-close'
                            },
                        )
                    )
                    //React.createElement(ArcticMapButton, { esriicon: 'close', onclick: this.toggle, style : { fontSize : '28px'} })
                ),
                
                React.createElement(
                    'p',
                    { style: { width: "300px", paddingLeft: "20px", wordWrap: "break-word", margin: "0px", whiteSpace: "pre-line" } },
                    this.props.infoAreaText
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

            this.root.render(ele);
        } else {
            var eleempty = React.createElement('span', null);
            this.root.render(eleempty);
        }
    }

}

export default ArcticMapPanel
