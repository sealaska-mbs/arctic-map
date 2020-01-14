import React from 'react';
import ReactDOM from "react-dom";
import ArcticMapButton from './ArcticMapButton';

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
        "overflowY": 'auto',
        "maxHeight": '100%'
    }

};

class ArcticMapPanel extends React.Component {
  static displayName = 'ArcticMapPanel';
  constructor (props) {
      super(props)

      this.toggle = function () {
        
        var currvalue = this.state.open;
        this.setState({ open: !currvalue });
    };

    this.mapFrame = document.getElementsByClassName('esri-view-root')[0];
    this.renderEle = document.createElement("span");
    this.mapFrame.appendChild(this.renderEle);
    this.state = {
        open: this.props.open || false
    };

  }
  componentDidUpdate(){
    this.renderPanel();
  }

  render(){
     
      return(<span><ArcticMapButton esriicon={this.props.esriicon} onclick={this.toggle.bind(this)} title={this.props.title} ></ArcticMapButton></span>);
  }
  renderPanel(){
      // refactor this
    if (this.state.open) {
        var ele = React.createElement(
            'div',
            { className: 'esri-widget', style: styles.rightWidgetFull },
            React.createElement(
                'h2',
                { style: { marginTop: '6px', position: 'absolute', left: '8px', top: '0' } },
                this.props.title
            ),
            React.createElement(
                'span',
                { style: { position: 'absolute', top: '0', right: '0' } },
                React.createElement(ArcticMapButton, { esriicon: 'close', onclick: this.toggle.bind(this) })
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

        ReactDOM.render(ele, this.renderEle);
    } else {
        var eleempty = React.createElement('span', null);
        ReactDOM.render(eleempty, this.renderEle);
    }
  }

}

export default ArcticMapPanel