import React from "react";
import "./Loader.css"; // We'll create this CSS file next

export default function Loader() {
  return (
    <div className="loader-main">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  );
}
