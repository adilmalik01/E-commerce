import baseUrl from "../../core";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/alert";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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

const fullNameSchema = Yup.string()
  .required("Full name is required")
  .matches(/^[a-zA-Z\s]+$/, "Full name must only contain letters and spaces")
  .min(2, "Full name must be at least 2 characters long")
  .trim();

let validationSchema = Yup.object({
  fullName: fullNameSchema,
  email: Yup.string().email("Invalid Email").required("Email Required"),
  password: passwordSchema,
});

const SignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let response = await axios.post(`${baseUrl}/api/v1/signup`, {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        });
        Alert("Signup Succesfully");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } catch (error) {
        console.log(error);
      }
    },
  });


  return (
    <>
      <div className="w-full  h-[100vh] flex justify-center items-center bg-[#f5f7f9]">
        <div className="flex flex-col mt-20  items-center justify-center w-96 min-h-[70%] fixed bg-[#ffff] ">
          <h1 className="p-5 text-2xl font-semibold text-black font-mono">
            Sign up
          </h1>
          <form
            className="flex w-full flex-col items-center gap-3"
            onSubmit={formik.handleSubmit}
          >
            <TextField
              fullWidth
              id="outlined-error-helper-text"
              label="Enter your Fullname"
              name="fullName"
              type="text"
              style={{
                width: "80%",
                marginTop: "10px",
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
            <TextField
              id="outlined-error-helper-text"
              label="Enter your Email"
              name="email"
              type="email"
              style={{
                width: "80%",
                marginTop: "10px",
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              id="outlined-error-helper-text"
              label="Enter your Password"
              name="password"
              type="password"
              style={{
                width: "80%",
                marginTop: "10px",
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Button type="submit" variant="contained">
              Signup
            </Button>
          </form>
          <div className="w-full flex justify-between items-center px-4">
            <p className="font-semibold">I Already have Acount</p>
            <Link to={"/login"}>
              <p className="font-semibold text-blue-700">Log In</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
