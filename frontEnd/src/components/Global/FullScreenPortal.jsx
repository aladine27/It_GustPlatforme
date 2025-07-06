
import React from "react";
import ReactDOM from "react-dom";

export default function FullScreenPortal({ open, children }) {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 3000,
      background: "#fff",
      overflow: "auto",
      minHeight: "100vh",
      width: "100vw"
    }}>
      {children}
    </div>,
    document.body
  );
}
