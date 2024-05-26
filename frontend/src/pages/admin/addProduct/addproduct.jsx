import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Alert from "../../../components/alert";
import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../../core";

const AddProduct = () => {
  const productName = useRef(null);
  const productBrand = useRef(null);
  const productSection = useRef(null);
  const productPrice = useRef(null);
  const productImage = useRef(null);
  const productCategory = useRef(null);
  const productDetail = useRef(null);
  const navigate = useNavigate();
  const [category, setCategorys] = useState([]);
  const [file, setFile] = useState();
  //   const notify = () => toast("Wow so easy!");

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

  useEffect(() => {
    fetchCategory();
  }, []);

  const ProductHandler = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();

      formData.append("productName", productName.current.value);
      formData.append("productBrand", productBrand.current.value);
      formData.append("productSection", productSection.current.value);
      formData.append("productPrice", productPrice.current.value);
      formData.append("productImage", productImage.current.files[0]);
      formData.append("productCategory", productCategory.current.value);
      formData.append("productDetail", productDetail.current.value);
      const response = await axios.post(
        `${baseUrl}/api/v1/addproduct`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Alert("Product Created");

      navigate("/veiwproducts");
    } catch (error) {
      console.log(error);
    }
  };

  let style = {
    style1: "  w-full border rounded-md p-2 border-black h-12 outline-none",
  };

  return (
    <>
      <div className=" flex absolute right-0  py-10 justify-center items-center w-4/5 min-h-screen ">
        <form
          onSubmit={ProductHandler}
          className=" w-4/5 mx-auto p-8 bg-white shadow-lg flex flex-col items-center rounded-md"
        >
          <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>

          <div className="mb-4 w-4/5">
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              ref={productName}
              className={style.style1}
              placeholder="Enter product name"
            />
          </div>

          <div className="mb-4 w-4/5">
            <label
              htmlFor="productBrand"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Brand
            </label>
            <input
              type="text"
              id="productBrand"
              ref={productBrand}
              className={style.style1}
              placeholder="Enter product brand"
            />
          </div>

          <div className="mb-4 w-4/5">
            <label
              htmlFor="productSection"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Section
            </label>
            <select
              ref={productSection}
              className={style.style1}
            >
              <option value="default" selected>Default</option>
              <option value="new arrival">New Arrivals</option>
              <option value="Popular">Popular</option>
              <option value="discounted">Discounted</option>
            </select>
          </div>

          <div className="mb-4 w-4/5">
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Price
            </label>
            <input
              type="number"
              id="productPrice"
              ref={productPrice}
              className={style.style1}
              placeholder="Enter product price"
            />
          </div>

          <div className="mb-4 w-4/5">
            <label
              htmlFor="productCategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Category
            </label>
            <select
              id="productCategory"
              ref={productCategory}
              className={style.style1}
            >
              {category.map((c, i) => (
                <option key={c._id} value={c.category}>
                  {c.category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 w-4/5">
            <label
              htmlFor="productImage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Image
            </label>
            <div className="flex flex-col gap-5 w-4/5justify-center items-center">
              <input
                type="file"
                id="productImage"
                accept="images/*"
                ref={productImage}
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden "
              />
              <label
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700  w-full border  p-2 border-black h-12 rounded-md cursor-pointer hover:bg-gray-300"
                htmlFor="productImage"
              >
                <Icon.Image className="mr-2" size={20} color="black" />
                Upload Image
              </label>
              {file && (
                <img
                  className="ml-4  w-[80%] block h-72 object-cover rounded-md border border-gray-300"
                  src={URL.createObjectURL(file)}
                  alt="Product Preview"
                />
              )}
            </div>
          </div>

          <div className="mb-4 w-4/5">
            <label
              htmlFor="productDetail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Detail
            </label>
            <textarea
              id="productDetail"
              ref={productDetail}
              className=" w-full border rounded-md p-2 border-black h-32 resize-none outline-none"
              placeholder="Enter product detail"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-4/5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Add Product
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
