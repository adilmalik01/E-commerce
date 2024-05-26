import { useEffect, useState } from "react";
import baseUrl from "../../../core";
import axios from "axios";
import * as Icon from "react-bootstrap-icons";
import Swal from "sweetalert2";

const Catergory = () => {
  let [value, setValue] = useState("");
  const [category, setCategorys] = useState([]);

  const fetchCategory = async (e) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/all-category`, {
        withCredentials: true,
      });
      setCategorys(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteHandler = async (id) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/delete-category/${id}`
      );
      fetchCategory();
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateHandler = async (id, C_name) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Category",
      html: `
        <input id="swal-input2"  class="swal2-input">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return [document.getElementById("swal-input2").value];
      },
    });
    if (formValues) {
      let val = formValues[0];
      try {
        const response = await axios.put(
          `${baseUrl}/api/v1/update-category/${id}`,
          { name: val }
        );
        fetchCategory();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const CategoryHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/v1/create-category`, {
        name: value,
      });
      fetchCategory();
      value = "";
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <>
      <div className="  w-4/5 absolute right-0 flex justify-center flex-col  min-h-screen">
        <div className="  flex h-[30vh]  w-full justify-center items-center">
          <form
            onSubmit={CategoryHandle}
            className=" w-3/4 flex flex-col justify-center items-center   gap-6"
          >
            <input
              className=" w-[60%] h-12 rounded-md outline-none border border-black p-3"
              type="text"
              placeholder="Add Category"
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <button
              className="w-[30%] h-10 rounded-md p-2 bg-blue-600"
              type="submit"
            >
              Add
            </button>
          </form>
        </div>
        <div className="flex items-center w-full flex-col min-h-[70vh]">
          <div className="w-[50%] h-10 border bg-black/55 text-white border-black flex">
            <div className="w-[10%] flex justify-center items-center">#</div>
            <div className="w-[50%] flex justify-center items-center">
              <h1>Category Name</h1>
            </div>
            <div className="w-[40%] flex justify-center items-center">
              <h1>Action</h1>
            </div>
          </div>
          {category.length ? (
            category.map((c, i) => {
              return (
                <div
                  key={c._id}
                  className="w-[50%] border p-5  border-black flex"
                >
                  <div className="w-[10%] flex   border-r  border-black justify-center items-center">
                    {i + 1}
                  </div>
                  <div className="w-[50%]  font-medium flex justify-center items-center">
                    <h1>{c.category}</h1>
                  </div>
                  <div className="w-[40%] gap-3 flex  h-full border-l  border-black justify-center items-center">
                    <button
                      onClick={() => {
                        UpdateHandler(c._id, c.category);
                      }}
                      className="p-2 bg-green-600 "
                    >
                      <Icon.PencilFill />
                    </button>
                    <button
                      onClick={() => {
                        DeleteHandler(c._id);
                      }}
                      className="p-2 bg-red-600 "
                    >
                      <Icon.Trash />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-[40vh] w-full flex justify-center  text-center items-center">
              <h1 className=" font-extrabold text-2xl">NO CATEGORY</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Catergory;
