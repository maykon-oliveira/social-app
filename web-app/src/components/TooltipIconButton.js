import React from "react";
import { Tooltip, IconButton } from "@material-ui/core";

const TooltipIconButton = ({ children, onClick, title, placement = "top" }) => (
  <Tooltip title={title} placement={placement}>
    <IconButton onClick={onClick}>{children}</IconButton>
  </Tooltip>
);

export default TooltipIconButton;
