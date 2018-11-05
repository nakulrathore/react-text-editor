import React, { Component } from 'react';


//components import
import Editor from './components/Editor'

//files import
import logo from './assets/images/logo.png'
class App extends Component {
  render() {
    return (
      <div className="notepadx">
      <div className="logo">
      <span>
        <img src={logo} alt="logo" title="drag me to editor"/>
        </span>NotepadX
      </div>
      <Editor/>
      </div>
    );
  }
}

export default App;
