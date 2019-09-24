import React from "react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner-wrap">
      <div className="lds-css ng-scope">
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    </div>
  );
};

export default Spinner;