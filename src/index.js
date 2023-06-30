import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./app";
import "./index.css";

// secret id: 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
// client id: 497605610826-92jrc78dt6f60oi43kc2l84ree410863.apps.googleusercontent.com

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <App />
    </GoogleOAuthProvider>
  </Router>
);
