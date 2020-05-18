import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { Paper, Link as MLink, Typography, Button } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  LocationOn,
  Link as LinkIcon,
  CalendarToday,
} from "@material-ui/icons";

import dayjs from "dayjs";

const styles = {};

const Profile = ({
  user: { credentials, loading, authenticated },
  classes,
}) => {
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
    <Paper>
      <div>
        <img src={credentials.imageUrl} alt="profile" />
      </div>
      <div>
        <MLink
          component={Link}
          to={`/usser/${credentials.handle}`}
          color="primary"
          variant="h5"
        >
          @{credentials.handle}
        </MLink>
      </div>
      <div>
        {credentials.bio && (
          <Typography variant="body2">{credentials.bio}</Typography>
        )}
      </div>
      <div>
        {credentials.location && (
          <>
            <LocationOn color="primary" />
            <span>{credentials.location}</span>
          </>
        )}
      </div>
      <div>
        {credentials.website && (
          <>
            <LinkIcon color="primary" />
            <a href={credentials.website} rel="" target="_black">
              {credentials.website}
            </a>
          </>
        )}
      </div>
      <div>
        <CalendarToday color="primary" />
        Joined {dayjs(credentials.createdAt).format("MMM YYYY")}
      </div>
    </Paper>
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

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(withStyles(styles)(Profile));
