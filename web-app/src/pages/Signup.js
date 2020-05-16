import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";

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

const Signup = ({ history, classes }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = ({ target: { name, value } }) =>
    setForm({ ...form, [name]: value });
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    Axios.post("/signup", form)
      .then(({ token }) => token)
      .then((token) => sessionStorage.setItem("FBToken", token))
      .then(() => {
        history.push("/");
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setErrors(e.response.data);
        setLoading(false);
      });
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
            value={form.handle}
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
            value={form.email}
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
            value={form.password}
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
            value={form.confirmPassword}
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

export default withStyles(styles)(Signup);
