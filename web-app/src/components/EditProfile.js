import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Creators as UserCreators } from "../store/ducks/user";
import {
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  DialogActions,
} from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";

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

const EditProfile = ({
  editProfile,
  credentials,
  classes,
  ui: { errors },
  loading,
}) => {
  const [openup, setOpenup] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  const fillForm = ({ bio, website, location }) =>
    setProfileForm({
      bio: bio || "",
      website: website || "",
      location: location || "",
    });

  const openModal = () => {
    fillForm(credentials);
    setOpenup(true);
  };

  const closeModal = () => {
    setOpenup(false);
  };

  const onSubmit = () => editProfile(profileForm);

  const onChange = ({ target: { name, value } }) =>
    setProfileForm({
      ...profileForm,
      [name]: value,
    });

  return (
    <>
      <Tooltip title="Edit profle" placement="top">
        <IconButton onClick={openModal}>
          <EditIcon color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog open={openup} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit profile</DialogTitle>
        <DialogContent>
          <form noValidate>
            <TextField
              id="bio"
              name="bio"
              type="text"
              label="Bio"
              fullWidth
              helperText={errors.bio}
              error={!!errors.bio}
              className={classes.textField}
              onChange={onChange}
              multiline
              rows="3"
              value={profileForm.bio}
            ></TextField>
            <TextField
              id="location"
              name="location"
              type="text"
              label="Location"
              fullWidth
              helperText={errors.location}
              error={!!errors.location}
              className={classes.textField}
              onChange={onChange}
              value={profileForm.location}
            ></TextField>
            <TextField
              id="website"
              name="website"
              type="text"
              label="Website"
              fullWidth
              helperText={errors.website}
              error={!!errors.website}
              className={classes.textField}
              onChange={onChange}
              value={profileForm.website}
            ></TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <div className={classes.wrapper}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={onSubmit}
            >
              Save
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  loading: state.user.loading,
  ui: state.ui,
});
const mapDispatchToPros = (dispatch) =>
  bindActionCreators(UserCreators, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToPros
)(withStyles(styles)(EditProfile));
