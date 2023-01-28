import { useState, useCallback, useRef, useEffect } from "react";
import { sendMessage } from "../utils/doodleApi";
import barStyles from "./MessageBar.module.css";

const MessageBar = ({
  reloadMessages,
}: {
  reloadMessages: () => Promise<unknown>;
}) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSendMessage = useCallback(() => {
    if (
      !process.env.REACT_APP_MESSAGE_AUTHOR ||
      !inputRef.current ||
      isSending
    ) {
      return;
    }

    setIsSending(true);
    sendMessage({
      author: process.env.REACT_APP_MESSAGE_AUTHOR,
      message: inputRef.current?.value,
    })
      .then(reloadMessages)
      .then(() => {
        if (inputRef.current) inputRef.current.value = "";
        window.scrollTo(0, document.body.scrollHeight);
      })
      .finally(() => {
        setIsSending(false);
      });
  }, [isSending, reloadMessages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef]);

  return (
    <div className={barStyles["message-bar"]}>
      <div className={barStyles["input-container"]}>
        <input
          type="text"
          placeholder="Message"
          id="message-text"
          name="message-state"
          className={barStyles["message-input"]}
          ref={inputRef}
          onKeyUp={(event) => {
            if (event.code === "Enter") {
              onSendMessage();
            }
          }}
        />
        <button
          disabled={isSending}
          className={barStyles["send-button"]}
          onClick={onSendMessage}
        >
          {isSending ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
