import { useState, useEffect, useRef, useCallback } from "react";
import messageStyles from "./ChatMessage.module.css";
import ChatMessage from "./ChatMessage";
import MessageBar from "./MessageBar";
import { fetchMessages, LocalChatMessage } from "../utils/doodleApi";

const POLL_INTERVAL = 3000;
const MSG_LIMIT = 50;

const ChatMessages = () => {
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const lastPollTimestamp = useRef<number | null>(null);
  const pollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pollForMessages = useCallback(() => {
    if (pollTimeout.current) clearTimeout(pollTimeout.current);

    return fetchMessages({
      since: new Date(lastPollTimestamp.current || 0),
      limit: MSG_LIMIT,
    })
      .then((apiMessages) => {
        const latestTimestamp = Math.max(
          ...apiMessages.map((message) => message.sentAt.getTime())
        );

        if (
          lastPollTimestamp.current === null ||
          latestTimestamp > (lastPollTimestamp.current || 0)
        ) {
          setMessages([...messages, ...apiMessages]);
        }
        lastPollTimestamp.current = new Date().getTime();
      })
      .finally(() => {
        pollTimeout.current = setTimeout(pollForMessages, POLL_INTERVAL);
      });
  }, [messages]);

  useEffect(() => {
    pollForMessages().then(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    return () => {
      if (pollTimeout.current) clearTimeout(pollTimeout.current);
    };
  });

  return (
    <>
      <div className={messageStyles["chat-bg"]}>
        {messages.map(({ _id, author, sentAt, message }) => (
          <ChatMessage
            key={_id}
            author={author}
            sendTime={sentAt}
            message={message}
            sentByUs={author === process.env.REACT_APP_MESSAGE_AUTHOR}
          />
        ))}
      </div>
      <MessageBar reloadMessages={pollForMessages} />
    </>
  );
};

export default ChatMessages;
