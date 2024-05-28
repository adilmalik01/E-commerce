import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import baseUrl from "../../core";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import Alert, { RedAlert } from "../../components/alert";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

let validationSchema = Yup.object({
  email: Yup.string().email("Invalid Email").required("Email Required"),
});

const ForgetPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
   
      try {
        let { data } = await axios.post(`${baseUrl}/api/v1/forget-password`, {
          email: values.email,
        });
        Alert(data.message);
        if (data.status === "sucess") {
          localStorage.setItem("email", values.email)
          navigate("/otp");
        }
      } catch (error) {
        RedAlert(error.response.data.message)
      }
    },
  });

  return (
    <>
      <div className="h-screen w-full flex justify-center  items-center">
        <div className=" w-[410px] mt-20 h-[350px] bg-[#f5f7f9]">
          <h1 className=" text-2xl text-center pt-3 font-bold">
            Forget Password
          </h1>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-6  justify-center items-center"
          >
            <TextField
              id="outlined-error-helper-text"
              label="Enter your Email"
              name="email"
              style={{
                width: "80%",
                marginTop: "50px",
              }}
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
