import React from "react";
import ReactDOM from "react-dom";
import MainContextProvider from "./context/MainContext";
import AuthContextProvider from "./context/AuthContext";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <MainContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </MainContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
