import barStyles from "./MessageBar.module.css";

const MessageBar = () => (
  <div className={barStyles["message-bar"]}>
    <div className={barStyles["input-container"]}>
      <input
        type="text"
        placeholder="Message"
        id="message-text"
        name="message-state"
        className={barStyles["message-input"]}
      />
      <button className={barStyles["send-button"]}>Send</button>
    </div>
  </div>
);

export default MessageBar;
