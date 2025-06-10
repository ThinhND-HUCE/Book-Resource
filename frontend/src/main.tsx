import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // import file App.tsx
import "./index.css"; // nếu bạn dùng Tailwind hoặc CSS toàn cục

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <App />
);
