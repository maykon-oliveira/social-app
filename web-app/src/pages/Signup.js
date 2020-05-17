import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
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

const Signup = ({ classes, signup, user: { loading }, ui: { errors } }) => {
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
  });

  const onChange = ({ target: { name, value } }) =>
    setSignupForm({ ...signupForm, [name]: value });

  const onSubmit = (e) => {
    e.preventDefault();
    signup(signupForm);
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm></Grid>
      <Grid item sm>
        <Typography variant="h2" className={classes.pageTitle}>
          Signup
        </Typography>
        <form noValidate onSubmit={onSubmit}>
          <TextField
            id="handle"
            name="handle"
            type="handle"
            label="Handle"
            helperText={errors.handle}
            error={!!errors.handle}
            className={classes.textField}
            fullWidth
            onChange={onChange}
            value={signupForm.handle}
          ></TextField>
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
            value={signupForm.email}
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
            value={signupForm.password}
          ></TextField>
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            helperText={errors.confirmPassword}
            error={!!errors.confirmPassword}
            className={classes.textField}
            fullWidth
            onChange={onChange}
            value={signupForm.confirmPassword}
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
              Signup
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
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
)(withStyles(styles)(Signup));
