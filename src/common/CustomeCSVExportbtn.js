import React from "react";

export default function CustomeCSVExportbtn({ onClick }) {
  return (
    <div className="export-btn-container">
      <button className="btn export-btn" onClick={onClick}>
        Export to CSV
      </button>
    </div>
  );
}
