import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
    objectFit: "cover",
  },
  content: {
    padding: 25,
    flex: "1 0 auto",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
};

const Scream = ({
  scream: { userImage, body, createdAt, userHandle },
  classes,
}) => {
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image={userImage}
        title="Profile media"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography
            color="primary"
            variant="h5"
            component={Link}
            to={`/users${userHandle}`}
          >
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {createdAt}
          </Typography>
          <Typography variant="body2">{body}</Typography>
        </CardContent>
      </div>
    </Card>
  );
};

export default withStyles(styles)(Scream);
