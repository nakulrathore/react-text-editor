import React, { Component } from "react";
class Preview extends Component {
  render() {
    return (
      <div className={`preview-wrapper ${this.props.isVisible ? '' : 'hidden'}`}>
        <div className="preview-content">
          <div className="close" onClick={this.props.close.bind(this)}>X</div>
          <div  dangerouslySetInnerHTML={{__html: this.props.currentHTML}} ></div>
        </div>
      </div>
    );
  }
}

export default Preview;
