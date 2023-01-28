import messageStyles from "./ChatMessage.module.css";
import ChatMessage from "./ChatMessage";

const ChatMessages = () => {
  return (
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
