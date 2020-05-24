import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Creators as UserCreators } from "../store/ducks/user";

import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  IconButton,
  Link as MLink,
  Typography,
  Button,
  Tooltip,
} from "@material-ui/core";
import { Edit, KeyboardReturn } from "@material-ui/icons";
import Skeleton from "@material-ui/lab/Skeleton";
import EditProfile from "./EditProfile";

import dayjs from "dayjs";
import "./profile.css";

const styles = {};

const Profile = ({
  user: { credentials, loading, authenticated },
  uploadUserImage,
  logout,
  classes,
}) => {
  const onImageChange = ({ target: { files } }) => {
    const img = files[0];
    const formData = new FormData();
    formData.append("image", img, img.name);
    uploadUserImage(formData);
  };

  return loading ? (
    <>
      <span style={{ display: "flex", justifyContent: "center" }}>
        <Skeleton variant="circle" width={60} height={60} />
      </span>
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width={80} />
    </>
  ) : authenticated ? (
    <div className="card-container">
      <div>
        <img className="round" src={credentials.imageUrl} alt="profile" />
        <input id="imgInput" type="file" onChange={onImageChange} hidden />
        <IconButton
          style={{ position: "absolute" }}
          color="secondary"
          onClick={() => {
            document.getElementById("imgInput").click();
          }}
        >
          <Edit />
        </IconButton>
      </div>
      <h3>
        <MLink to={`/user/${credentials.handle}`}>@{credentials.handle}</MLink>
      </h3>
      <h6>{credentials.location}</h6>
      <p>{credentials.bio}</p>
      <p>Joined at {dayjs(credentials.createdAt).format("MMM YYYY")}</p>
      <Tooltip title="Logout" placement="top">
        <IconButton onClick={() => logout()}>
          <KeyboardReturn color="primary"></KeyboardReturn>
        </IconButton>
      </Tooltip>
      <EditProfile/>
    </div>
  ) : (
    <Paper>
      <Typography variant="h5" align="center">
        No profile found please login
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/login">
        LOGIN
      </Button>
      <Button variant="contained" component={Link} to="/signup">
        SIGNUP
      </Button>
    </Paper>
  );
};

const mapDispatchToPros = (dispatch) =>
  bindActionCreators(UserCreators, dispatch);
const mapStateToProps = (state) => ({ user: state.user });

export default connect(
  mapStateToProps,
  mapDispatchToPros
)(withStyles(styles)(Profile));
