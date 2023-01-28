import messageStyles from "./ChatMessage.module.css";
import ChatMessage from "./ChatMessage";

const ChatMessages = () => {
  return (
    <div className={messageStyles["chat-bg"]}>
      <ChatMessage
        sender="testUser"
        sendTime={new Date()}
        message="Some test message"
      />
      <ChatMessage sendTime={new Date()} message="Some test message" sentByUs />
      <ChatMessage sendTime={new Date()} message="Some test message" sentByUs />
      <ChatMessage
        sender="testUser"
        sendTime={new Date()}
        message="Some test message"
      />
      <ChatMessage sendTime={new Date()} message="Some test message" sentByUs />
    </div>
  );
};

export default ChatMessages;
