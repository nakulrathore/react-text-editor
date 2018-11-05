import React, { Component } from "react";
import { cloneDeep } from "lodash";

//components import
import Preview from "./PreviewPost";

//constants import
import { execCommands, emojis } from "./constans";

class Editor extends Component {
  constructor() {
    super();
    this.state = {
      showLinkInput: false,
      currentHTML: "",
      range: {},
      showEmojiBoard : false,
      isPreviewVisible: false
    };
  }

  handleExecButtonClick(command, value, e) {
    e.preventDefault(); //preventing unselecting the selected text
    e.stopPropagation();
    let oldState = cloneDeep(this.state);
    if (command === "link") {
      oldState.showLinkInput = !this.state.showLinkInput;
    } else if(command === 'emoji'){
      oldState.showEmojiBoard = !this.state.showEmojiBoard;
    } else{
      let isExeced = document.execCommand(command, false, value);
      console.log("performed execCommand was :", isExeced);
    }
    oldState.range = this.saveSelection();
    this.setState(oldState);
  }

  saveSelection() {
    if (window.getSelection) {
      let sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    } else if (document.selection && document.selection.createRange) {
      return document.selection.createRange();
    }
    return null;
  }

  restoreSelection(range) {
    if (range) {
      if (window.getSelection) {
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (document.selection && range.select) {
        range.select();
      }
    }
  }


  applyEmoji(emoji ,e){
    let oldState = cloneDeep(this.state);
    oldState.showEmojiBoard = false;
    this.setState(oldState,this.restoreSelection(this.state.range))
    document.execCommand('insertText', false, emoji);
  }

  handleLink(event) {
    let oldState = cloneDeep(this.state);
    if (event.keyCode === 13) {
      let url = event.target.value;
      oldState.showLinkInput = false;
      this.setState(oldState, this.restoreSelection(this.state.range));
      document.execCommand("createLink", false, url);
      event.target.value = "";
    }
  }

  togglePreview() {
    // alert('called')
    console.log(this.refs);
    let oldState = cloneDeep(this.state);
    oldState.isPreviewVisible = !oldState.isPreviewVisible;
    oldState.currentHTML = this.refs.editor.innerHTML;
    this.setState(oldState);
  }

  exportFile(){
   
      var file = new Blob([ new TextEncoder().encode( this.refs.editor.innerHTML ) ], {type: "text/plain;charset=utf-8"});
      let href = window.URL.createObjectURL(file);

      console.log(href, this.refs)
      
      this.refs.download.href = href;
      this.refs.download.click();

    
  }

  componentDidMount(){
    this.saveSelection();
  }

  render() {
    return (
      <span className="editor">
      <a href="#download" ref="download" download="export.html" className="hidden">downloadbutton</a>
        <div className="execButtons">
          {Object.keys(execCommands).map((command, index) => [
            <div
              key={index}
              className={`execButton ${command}`}
              onMouseDown={this.handleExecButtonClick.bind(
                this,
                execCommands[command].command,
                execCommands[command].value
              )}
              title={command}
            >
              {execCommands[command].placeholder}
            </div>,
            command === "link" ? (
              <input
                type="text"
                className={`execButton input ${this.state.showLinkInput ? "open" : ""}`}
                placeholder="Paste link here..."
                onKeyUp={this.handleLink.bind(this)}
              />
            ) : (
              ""
            )
          ])}

          

          <span
            className={`execButton emoji`}
            onMouseDown={this.handleExecButtonClick.bind(this, "emoji", "")}
            title="emojis"
            role="img"
            aria-label="emoji"
          >
            😉
          </span>
          <div className={`emojiBoard ${this.state.showEmojiBoard ? '' : 'hidden'}`}>
              {emojis.map(emoji => (
                <span role="img" className="one-emoji" aria-label="emoji" onClick={this.applyEmoji.bind(this,emoji)}>
                  {emoji}
                </span>
              ))}
            </div>
        </div>
        <div
          className="editable"
          id="editable"
          data-ph="Start typing..."
          contentEditable
          spellcheck="false"
          ref="editor"
        >
          i dont know what to write here , maybe some <u>lorem ipsum</u> or maybe a joke, (i cant
          think of any right now , too high)
          <br />
          btw you can <b>drag any image here</b> to use , <i>try dragging the logo here</i>
        </div>
        <div className="bigButtons">
          <div className="button" onClick={this.togglePreview.bind(this)}>
            Preview Post
          </div>
          <div className="button" onClick={this.exportFile.bind(this)}>Export</div>
        </div>
        <Preview
          currentHTML={this.state.currentHTML}
          isVisible={this.state.isPreviewVisible}
          close={this.togglePreview.bind(this)}
        />
      </span>
    );
  }
}

export default Editor;
