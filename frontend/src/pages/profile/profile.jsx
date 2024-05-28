import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from "axios";
import Swal from "sweetalert2";
import OrderCard from "../../components/orderItem";
import { GlobalContext } from "../../context/context";
import baseUrl from "../../core";

const Profile = () => {
  const { state } = useContext(GlobalContext);
  const userId = state.user._id;
  const queryClient = useQueryClient();

  // Fetch orders data
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery(
    ['orders', userId],
    async () => {
      const response = await axios.get(`${baseUrl}/api/v1/order/${userId}`);
      return response.data;
    }
  );

  // Fetch profile data
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery(
    ['profile', userId],
    async () => {
      const response = await axios.get(`${baseUrl}/api/v1/user/${userId}`);
      return response.data;
    }
  );

  // Mutation for editing profile image
  const editImageMutation = useMutation(
    async (formData) => {
      const response = await axios.put(
        `${baseUrl}/api/v1/update/user/${userId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile'); // Invalidate profile query to refetch data
      }
    }
  );

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${baseUrl}/api/v1/logout`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle profile image editing
  const handleEditImage = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Profile",
      html: `
        <input type="text" id="fullName" value="${profile[0]?.fullName}" class="swal2-input" placeholder="Enter your full name">
        <input type="file" id="image" class="swal2-file" accept="image/*" aria-label="Upload your profile picture">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const fullName = document.getElementById("fullName").value;
        const imageInput = document.getElementById("image");
        const imageFile = imageInput.files[0];
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("updateText", fullName);
        return formData;
      },
    });

    if (formValues) {
      try {
        await editImageMutation.mutateAsync(formValues);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Render loading state
  if (ordersLoading || profileLoading) return <div>Loading...</div>;

  // Render error state
  if (ordersError || profileError) return <div>Error: {ordersError || profileError}</div>;

  return (
    <div className="container mx-auto mt-20">
      <div
        style={{ height: "35vh" }}
        className="flex items-center rounded-md  bg-black/50 w-full justify-center"
      >
        <div className="flex items-center">
          <div className="  relative">
            <img
              src={profile[0]?.profileAvatar}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold  capitalize font-serif">
              {profile[0]?.fullName}
            </h1>
            <p className="text-white font-semibold">
              Joined: {profile[0]?.createdAt}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full  h-16 flex justify-center items-center">
        <button
          className="w-32 font-mono  text-white font-medium outline-none h-12 m-4 rounded-lg border bg-green-600 
                  hover:bg-white transition-all duration-1000 hover:border-green-600  hover:text-black
                "
          onClick={() => {
            handleEditImage();
          }}
        >
          Edit
        </button>
        <button
          className="w-32 font-mono  text-white font-medium outline-none h-12 m-4 rounded-lg border bg-red-600 
                  hover:bg-white transition-all duration-1000 hover:border-red-600 hover:text-black
                "
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <div className="mt-8">
        <h2 className="font-semibold mb-4 text-2xl ">Order History</h2>
        <div className="grid grid-cols-1 py-8  md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Assuming user.orders is an array containing order objects */}
          {orders.length ? (
            orders.map((order) => <OrderCard key={order._id} order={order} />)
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <h1 className=" text-3xl font-extrabold font-mono">
                Order History Is Empty
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
