import baseUrl from "../../core";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
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
    password: passwordSchema,
    password: passwordSchema,
});

const ResetPassword = () => {
    const navigate = useNavigate();


    const formik = useFormik({
        initialValues: {
            password: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let { data } = await axios.post(`${baseUrl}/api/v1/reset-password`, {
                    email: values.email,
                    password: values.password,
                    email: localStorage.getItem("email")
                });
                if (data.status === "succes") {
                    Alert(data.message);
                    navigate("/login");
                    localStorage.removeItem("email")
                }

            } catch (error) {
                RedAlert(error.response.data.message)
            }
        },
    });

    return (
        <>
            <div className="w-full  h-[100vh]  flex justify-center items-center bg-[#f5f7f9]">
                <div className="flex flex-col mt-20 items-center justify-center   w-96 h-[450px] fixed bg-[#ffff] ">
                    <h1 className="p-5 text-2xl font-semibold text-black font-mono">
                        Reset Password
                    </h1>
                    <form
                        className="flex w-full flex-col justify-center items-center gap-2"
                        onSubmit={formik.handleSubmit}
                    >
                        <TextField
                            id="outlined-error-helper-text"
                            label="Enter your New Password"
                            name="newpassword"
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

                        <TextField
                            id="outlined-error-helper-text"
                            label="Confirm Password"
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
                            Reset
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
