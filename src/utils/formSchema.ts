import * as Yup from "yup";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const emailRegex = /^[^\s@]+@(?!.*\.\.)[^\s@]+\.com$/;

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const registerSchema = Yup.object({
  username: Yup.string()
    .required("Username is required"),
  email: Yup.string()
    .matches(emailRegex, "Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

export const forgotSchema = Yup.object({
  email: Yup.string().required("Email is required"),
});

export const verifyCodeSchema = Yup.object().shape({
  code: Yup.string().required("Code is required"),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});
