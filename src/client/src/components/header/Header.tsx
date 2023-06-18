import React from "react";
import "./header.scss";
import AddTransaction from "../addTransaction/AddTransaction";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";

const Header = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div id="header-container">
      <Drawer
        opened={opened}
        onClose={close}
        title={<h2>Add Transaction</h2>}
        position="right"
        size="sm"
      >
        <AddTransaction />
      </Drawer>

      <div id="header-title">BUDGET</div>

      <div id="header-add-transaction">
        <IconPlus id="header-icon" size={24} onClick={open} />
      </div>
    </div>
  );
};

export default Header;
