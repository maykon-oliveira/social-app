import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
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

const Login = ({ history, classes }) => {
  const [form, setForm] = useState({
    email: "maykon@email.com",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = ({ target: { name, value } }) =>
    setForm({ ...form, [name]: value });
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    Axios.post("/login", form)
      .then(({ jwt }) => jwt)
      .then((jwt) => sessionStorage.setItem("FBjwt", jwt))
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

export default withStyles(styles)(Login);
