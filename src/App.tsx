import React from "react";
import globalStyles from "./App.module.css";
import ChatMessages from "./components/ChatMessages";

function App() {
  return (
    <div className={globalStyles["page-container"]}>
      <ChatMessages />
    </div>
  );
}

export default App;
