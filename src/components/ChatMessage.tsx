import messageStyles from "./ChatMessage.module.css";

const ChatMessages = ({
  message,
  sendTime,
  sentByUs = false,
  sender,
}: {
  message: string;
  sendTime: Date;
  sentByUs?: boolean;
  sender?: string;
}) => {
  const justifyContent = sentByUs ? "flex-end" : "flex-start";
  const messageClass =
    messageStyles[sentByUs ? "our-message" : "their-message"];
  const bodyClass = messageStyles[sentByUs ? "body-ours" : "body-theirs"];
  const dateClass = messageStyles[sentByUs ? "date-ours" : "date-theirs"];

  return (
    <div className={`${messageStyles.container}`} style={{ justifyContent }}>
      <div className={`${messageStyles.message} ${messageClass}`}>
        {sender && <div className={`${messageStyles.sender}`}>{sender}</div>}
        <div className={`${messageStyles.body} ${bodyClass}`}>{message}</div>
        <div className={`${messageStyles.date} ${dateClass}`}>
          {sendTime.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
