import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link className="logo" to="/">
      <h1 className="text-xl sm:text-xl flex flex-wrap">
        <span className="text-theme-primary">BagIt</span>
        <span className="text-theme-primary font-bold px-1">NOW</span>
      </h1>
    </Link>
  );
};

export default Logo;
