import React from "react";
import ReactDOM from "react-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainContextProvider from "./context/MainContext";
import AuthContextProvider from "./context/AuthContext";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <MainContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </MainContextProvider>,
  document.getElementById("root")
);
