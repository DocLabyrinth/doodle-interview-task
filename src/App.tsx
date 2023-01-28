import React from "react";
import globalStyles from "./App.module.css";
import ChatMessages from "./components/ChatMessages";
import MessageBar from "./components/MessageBar";

function App() {
  return (
    <div className={globalStyles["page-container"]}>
      <ChatMessages />
      <MessageBar />
    </div>
  );
}

export default App;
