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
    otpCode: Yup.number().required("OTP is reqired").min(6, "Max length is 6")
});

const OTP = () => {
    const navigate = useNavigate();


    const formik = useFormik({
        initialValues: {
            otpCode: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
           
            try {
                let { data } = await axios.post(`${baseUrl}/api/v1/otp-send`, {
                    email: localStorage.getItem("email"),
                    otp: values.otpCode
                });
            
                if (data.status === "succes") {
                    Alert(data.message);
                    navigate("/reset-password");
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
                        OTP
                    </h1>
                    <form
                        onSubmit={formik.handleSubmit}
                        className="flex flex-col gap-6  justify-center items-center">

                        <TextField
                            id="outlined-error-helper-text"
                            label="Enter your OTP"
                            name="otpCode"
                            style={{
                                width: "80%",
                                marginTop: "50px",
                            }}
                            type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.otpCode && Boolean(formik.errors.otpCode)}
                            helperText={formik.touched.otpCode && formik.errors.otpCode}
                        />

                        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default OTP;