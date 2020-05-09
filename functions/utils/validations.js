const isEmail = (e) => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return e && e.match(reg);
};

const isEmpty = (s) => !s && s.trim() === "";

const validateSignupData = (data) => {
  const errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email))
    errors.email = "Must be a valid email address";

  if (isEmpty(data.password)) errors.password = "Must not me empty";

  if (data.password !== data.confirmPassword)
    errors.password = "Password must match";

  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

const validateLoginData = (data) => {
  const errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not me empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  isEmail,
  isEmpty,
  validateSignupData,
  validateLoginData,
};
