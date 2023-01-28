import { useState, useEffect, useRef, useCallback } from "react";
import messageStyles from "./ChatMessage.module.css";
import ChatMessage from "./ChatMessage";
import { fetchMessages, LocalChatMessage } from "../utils/doodleApi";

const POLL_INTERVAL = 3000;

const ChatMessages = () => {
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const lastPollTimestamp = useRef<number | null>(null);
  const pollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pollForMessages = useCallback(() => {
    if (pollTimeout.current) clearTimeout(pollTimeout.current);

    fetchMessages({ since: new Date(lastPollTimestamp.current || 0) })
      .then((apiMessages) => {
        const latestTimestamp = Math.max(
          ...apiMessages.map((message) => message.sentAt.getTime() / 1000)
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
    pollForMessages();
    return () => {
      if (pollTimeout.current) clearTimeout(pollTimeout.current);
    };
  });

  return (
    <div className={messageStyles["bottom-scroll-wrapper"]}>
      <div className={messageStyles["chat-bg"]}>
        {messages.map(({ _id, author, sentAt, message }) => (
          <ChatMessage
            key={_id}
            author={author}
            sendTime={sentAt}
            message={message}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
