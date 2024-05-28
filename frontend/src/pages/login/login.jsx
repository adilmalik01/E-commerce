import baseUrl from "../../core";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert, { RedAlert } from "../../components/alert";
import * as Yup from "yup";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const passwordSchema = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(
    /[@$!%*?&]/,
    "Password must contain at least one special character (@$!%*?&)"
  );

let validationSchema = Yup.object({
  email: Yup.string().email("Invalid Email").required("Email Required"),
  password: passwordSchema,
});

const Login = () => {

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let { status } = await axios.post(`${baseUrl}/api/v1/login`, {
          email: values.email,
          password: values.password,
        });


        if (status === 200) {
          Alert("Login Succesfully");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        RedAlert(error.response.data);
      }
    },
  });

  return (
    <>
      <div className="w-full  h-[100vh]  flex justify-center items-center bg-[#f5f7f9]">
        <div className="flex flex-col mt-20 items-center justify-between   w-96 h-[450px] fixed bg-[#ffff] ">
          <h1 className="p-5 text-2xl font-semibold text-black font-mono">
            Log In
          </h1>
          <form
            className="flex w-full flex-col items-center gap-2"
            onSubmit={formik.handleSubmit}
          >
            <TextField
              id="outlined-error-helper-text"
              label="Enter your Email"
              name="email"
              style={{
                width: "80%",
                marginTop: "10px",
              }}
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              id="outlined-error-helper-text"
              label="Enter your Password"
              name="password"
              style={{
                width: "80%",
                marginTop: "10px",
              }}
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button type="submit" variant="contained">
              Login
            </Button>
          </form>
          <div className="w-full flex justify-between items-center px-4">
            <p className="font-semibold">I don't have Acount</p>

            <Link to={"/signup"}>
              <p className="font-semibold text-blue-700">Create Account</p>
            </Link>
          </div>
          <div className="w-full flex justify-end items-center p-3">
            <Link to={"/forget-password"}>
              <p className="font-semibold text-red-700  underline">
                Forget Password
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
