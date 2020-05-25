import React from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import {
  Add as AddIcon,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
} from "@material-ui/icons";

import TooltipIconButton from "./TooltipIconButton";

import { connect } from "react-redux";

const Navbar = ({ authenticated }) => (
  <AppBar position="fixed">
    <Toolbar className="nav-container">
      {authenticated && (
        <>
          <TooltipIconButton title="Post">
            <AddIcon color="primary" />
          </TooltipIconButton>
          <Link to="/">
            <TooltipIconButton title="Screams">
              <HomeIcon color="primary" />
            </TooltipIconButton>
          </Link>
          <TooltipIconButton title="Notifications">
            <NotificationsIcon color="primary" />
          </TooltipIconButton>
        </>
      )}
      {!authenticated && (
        <>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
          <Button component={Link} to="/signup" color="inherit">
            Signup
          </Button>
        </>
      )}
    </Toolbar>
  </AppBar>
);

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Navbar);
