import { useRef, useContext } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import Footer from "../../components/footer";
import { GlobalContext } from "../../context/context";
import * as Yup from "yup"
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik"
import baseUrl from "../../core";
import Alert from "../../components/alert";
import Swal from "sweetalert2";
import React from "react";




let fullNameSchema = Yup.string()
  .matches(/^[A-Za-z\s]+$/, "Full name can only contain letters and spaces")
  .min(3, 'Fu ll name must be at least 2 characters')
  .max(15, 'Full name must be less than 50 characters')
  .required('Full name is required')

let emailSchema = Yup.string()
  .email('Invalid email address')
  .required('Email is required')

let phoneNumberSchema = Yup.number()
  .min(11, 'Phone number must be exactly 11 digits')
  .required('Phone number is required')

let addressSchema = Yup.string()
  .min(10, 'Address must be at least 10 characters')
  .max(50, 'Address must be less than 100 characters')
  .required('Address is required')

const validationSchema = Yup.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  address: addressSchema
});



const Cart = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.productPrice),
    0
  );


  let formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      address: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const orderData = {
          cart: JSON.parse(localStorage.getItem("cart")),
          userInfo: {
            Name: values.fullName,
            Email: values.email,
            Phonenumber: values.phoneNumber,
            Address: values.address,
          },
          totalPrice: totalPrice
        };
        await orderMutation.mutateAsync(orderData);
      } catch (error) {
        console.error("Error placing order:", error);
      }
    },
  })



  const remove = (productId) => {
    try {
      let myCart = [...state.cart];
      let ind = myCart.find((item) => item._id === productId);

      myCart.splice(ind, 1);
      localStorage.setItem("cart", JSON.stringify(myCart));
      dispatch({
        type: "CART",
        payload: myCart,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const orderMutation = useMutation(
    async (orderData) => {
      const response = await axios.post(
        `${baseUrl}/api/v1/addorder`,
        orderData
      );
      return response.data;
    },
    {
      onSuccess: () => {
        Alert("CheckOut SuccessFully");
        localStorage.removeItem("cart");
        window.location.reload();
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message || "Something went wrong",
          footer: '<a href="/login">Go to Login Page ?</a>',
        });
      },
    }
  );



  return (
    <>
      <div className="max-w-4xl mx-auto h-[100vh] mt-32 items-center p-4 flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 lg:mr-4 min-h-[50%] overflow-auto  lg:mb-0">
          <div className="border border-gray-300 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Your Cart</h3>
            {cartItems.length ? (
              cartItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between mb-4">
                  <div className="flex items-center w-2/3">
                    <img
                      src={item.CandinateAvatar}
                      alt={item.productName}
                      className="w-16 h-16 rounded-md object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold">{item.productName}</div>
                      <div className="text-gray-500">${item.productPrice}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div>YOUR CART IS EMPTY</div>
            )}
            <div className="flex justify-between mt-4">
              <span className="font-semibold">Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <div className="border border-gray-300 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <TextField
                  fullWidth
                  id="outlined-error-helper-text"
                  label="Enter your Fullname"
                  name="fullName"
                  type="text"
                  style={{ width: "100%", marginTop: "10px" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  id="outlined-error-helper-text"
                  label="Enter your email"
                  name="email"
                  type="email"
                  style={{ width: "100%", marginTop: "10px" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  id="outlined-error-helper-text"
                  label="Enter your Phone number"
                  name="phoneNumber"
                  type="number"
                  style={{ width: "100%", marginTop: "10px" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  id="address"
                  label="Enter your Address"
                  name="address"
                  type="text"
                  multiline
                  rows={4}
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  style={{ marginTop: "10px" }}
                />
              </div>
              {cartItems.length ? (
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
                >
                  Check Out
                </button>
              ) : (
                <button
                  type="submit"
                  disabled
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
                >
                  Check Out
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
