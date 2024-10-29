import React from "react";
import classes from "./AuthBox.module.css";
import HamahImage from '../../assets/Hamah.jpeg';

export default function AuthBox({ children }) {
  return (
    <div className={classes.main}>
      <div className={classes.box}>
        <div className="container-95">
          <div className={`${classes.icon}`}>
            <img src={HamahImage} alt="Logo" height={60} width={60}/>
          </div>
          <div className={classes.innerBox}>
            <div className="container-95">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
