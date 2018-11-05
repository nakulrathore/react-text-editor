import React, { Component } from "react";
import { emojis } from "./constans";
class EmojiBoard extends Component {
  render() {
    return (
        <div className={`emojiBoard ${this.props.showEmojiBoard ? "" : "hidden"}`}>
        {emojis.map(emoji => (
          <span
            role="img"
            className="one-emoji"
            aria-label="emoji"
            onClick={this.props.applyEmoji.bind(this, emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>
    );
  }
}

export default EmojiBoard;
