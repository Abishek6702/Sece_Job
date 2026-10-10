import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { AppProvider } from "./context/AppProvider.jsx";
import { MessageProvider } from "./context/MessageContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <MessageProvider>
        
        <App />
      </MessageProvider>
    </AppProvider>
  </BrowserRouter>
);
