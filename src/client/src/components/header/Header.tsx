import React from "react";
import "./header.scss";
import { IconPlus } from "@tabler/icons-react";

const Header = () => {
  return (
    <div id="header-container">
      <div id="header-title">BUDGET</div>

      <div id="header-add-transaction">
        <IconPlus id="header-icon" size={24} />
      </div>
    </div>
  );
};

export default Header;
