import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Creators as UserCreators } from "../store/ducks/user";

const styles = ({
  form,
  pageTitle,
  textField,
  wrapper,
  buttonProgress,
  error,
}) => ({
  form,
  pageTitle,
  textField,
  wrapper,
  buttonProgress,
  error,
});

const Login = ({ classes, login, user: { loading }, ui: { errors } }) => {
  const [loginForm, setLoginForm] = useState({
    email: "maykon@email.com",
    password: "23REYTHGFDG",
  });

  const onChange = ({ target: { name, value } }) =>
    setLoginForm({ ...loginForm, [name]: value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(loginForm);
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm></Grid>
      <Grid item sm>
        <Typography variant="h2" className={classes.pageTitle}>
          Login
        </Typography>
        <form noValidate onSubmit={onSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            helperText={errors.email}
            error={!!errors.email}
            className={classes.textField}
            fullWidth
            onChange={onChange}
            value={loginForm.email}
          ></TextField>
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            helperText={errors.password}
            error={!!errors.password}
            className={classes.textField}
            fullWidth
            onChange={onChange}
            value={loginForm.password}
          ></TextField>
          {errors.general && (
            <Typography className={classes.error} color="error">
              {errors.general}
            </Typography>
          )}
          <div className={classes.wrapper}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Login
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          <Typography>
            <small>
              Don't have an account? <Link to="/singup">signup</Link>
            </small>
          </Typography>
        </form>
      </Grid>
      <Grid item sm></Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({ user: state.user, ui: state.ui });
const mapDispatchToPros = (dispatch) =>
  bindActionCreators(UserCreators, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToPros
)(withStyles(styles)(Login));
