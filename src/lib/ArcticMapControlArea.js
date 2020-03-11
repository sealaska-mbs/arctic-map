import React from 'react';
import ReactDOM from "react-dom";

class ArcticMapControlArea extends React.Component {
    static displayName = 'ArcticMapControlArea';
    constructor(props) {
        super(props)
        
        this.controlNode = document.createElement("div");
        this.props.view.ui.add(this.controlNode, this.props.location);
    }

    componentDidUpdate() {
        if (this.controlNode) {
            ReactDOM.render(this.widgetRender(), this.controlNode, ()=>{
             
            });
        }
    }

    append(ele){
        this.props.children.push(ele);
    }

    widgetRender() {

        var self = this;
        var index = 0
     

        var children = React.Children.map(this.props.children, function (child) {
          
      
            // else if (child.type.name === 'ArcticMapLLDSearch') {
      
            //   return React.cloneElement(child, {
            //   })
      
            // } 
      
            
              return React.cloneElement(child, {
                am : self.props.am,
                map : self.props.am.state.map,
                view : self.props.am.state.view,
                //hostDiv : self.controlNode
                //ref: 'child-' + (index++)
                //ref: (c) => { if (c) { self.childrenElements.push(c); } return 'child-' + (index++) }
              })
            
          });

        

        return (<span className='arcticmap-area'>{children}</span>)
    }
    render() {
        return (<span></span>);
    }

}

export default ArcticMapControlArea;