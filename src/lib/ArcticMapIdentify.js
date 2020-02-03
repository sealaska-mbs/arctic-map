import React from 'react';
import ReactDOM from "react-dom";
import ArcticMapButton from './ArcticMapButton';



class ArcticMapIdentify extends React.Component {
  static displayName = 'ArcticMapIdentify';
  constructor(props) {
    super(props);

    this.state = { mode: 1 };

  }

  setmaptoidentify() {
    this.props.am.setMode("identify");
    this.setState({ mode: "identify" });

  }

  setmaptoselect() {

    if (this.props.am.state.mode === "select") {
      this.props.am.setMode("view");
      this.setState({ mode: "view" });
    }
    else {

      this.props.am.setMode("select");
      this.setState({ mode: "select" });
    }
  }

  render() {

    //cursor

    return (
      <span>

        <ArcticMapButton showactive={this.props.am.state.mode === "identify"} esriicon='question' title='Identify' onclick={this.setmaptoidentify.bind(this)} />
        <ArcticMapButton showactive={this.props.am.state.mode === "select"} esriicon='cursor' title='Select' onclick={this.setmaptoselect.bind(this)} />
      </span>


    )
  }

}

export default ArcticMapIdentify;