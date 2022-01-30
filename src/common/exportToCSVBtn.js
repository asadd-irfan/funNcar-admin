import React from "react";

export default function ExportToCSVBtn(props) {
  const handleClick = () => {
    props.onExport();
  };
  return (
    <div className="export-btn-container">
      <button className="btn export-btn" onClick={handleClick}>
        Export to CSV
      </button>
    </div>
  );
}
