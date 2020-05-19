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



  render() {

    //cursor

    return (
      <span>

        <ArcticMapButton showactive={this.props.am.state.mode === "description"} esriicon='question' title='Identify' onclick={this.setmaptoidentify.bind(this)} />
          </span>


    )
  }

}

export default ArcticMapIdentify;