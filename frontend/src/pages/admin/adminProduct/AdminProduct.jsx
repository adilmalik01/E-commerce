import * as Icon from "react-bootstrap-icons";
import Alert from "../../../components/alert";
import axios from "axios";
import baseUrl from "../../../core";
import Swal from "sweetalert2";
import { useState } from "react";

const AdminProdut = ({ product }) => {
  const [category, setCategorys] = useState([]);



  const DeleteProduct = async (id) => {
    try {
      let response = await axios.delete(
        `${baseUrl}/api/v1/delete-product/${id}`
      );
      Alert(`${response.data}`);
    } catch (error) {
      console.log(error);
    }
  };

  const EditProduct = async (id) => {
    try {
      // Fetch product data
      let { data } = await axios.get(`${baseUrl}/api/v1/product/${id}`);

      // Fetch categories
      const response = await axios.get(`${baseUrl}/api/v1/all-category`);
      setCategorys(response.data);

      // Generate categories HTML after setting state
      const categoriesHtml = response.data.map(c => `<option value="${c.category}">${c.category}</option>`).join('');

      // Show Swal modal with product data and categories
      const { value: formValues } = await Swal.fire({
        title: "Product Update",
        width: '600px',
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <input id="swal-input-name" required value="${data[0].productName}" class="swal2-input" placeholder="Product Name">
            <input id="swal-input-brand" required value="${data[0].productBrand}" class="swal2-input" placeholder="Brand">
            <input id="swal-input-price" required value="${data[0].productPrice}" class="swal2-input" placeholder="Price" type="number">
            <input id="swal-input-image" required class="swal2-file" type="file" accept="image/*">
            <img id="swal-image-preview" src="${data[0].CandinateAvatar}" alt="Image Preview" style="max-width: 100%; height: auto; margin-top: 10px;">
            <select id="swal-input-category" class="swal2-select">
              <option value="" disabled selected>Select Category</option>
              ${categoriesHtml}
            </select>
            <select id="swal-input-section" class="swal2-select">
              <option value="default" selected>Default</option>
              <option value="new arrival" >New Arrivals</option>
              <option value="discounted">Discounted</option>
              <option value="Popular">Popular</option>
              <!-- Add more sections as needed -->
            </select>
            <textarea id="swal-input-details" class="swal2-textarea" placeholder="Product Details">${data[0].productDetail}</textarea>
          </div>
        `,
        focusConfirm: false,
        preConfirm: async () => {
          const imageInput = document.getElementById("swal-input-image");
          let finalImage;
          const imageFile = imageInput.files[0];
          if (imageFile === undefined) {
            finalImage = document.getElementById("swal-image-preview").src
          } else {
            finalImage = imageInput.files[0]
          }
          let formData = new FormData();

          formData.append("productName", document.getElementById("swal-input-name").value);
          formData.append("productBrand", document.getElementById("swal-input-brand").value);
          formData.append("productSection", document.getElementById("swal-input-section").value);
          formData.append("productPrice", document.getElementById("swal-input-price").value);
          formData.append("productImage", finalImage);
          formData.append("productCategory", document.getElementById("swal-input-category").value);
          formData.append("productDetail", document.getElementById("swal-input-details").value);
          const response = await axios.put(
            `${baseUrl}/api/v1/update-product/${id}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          return {
            name: document.getElementById("swal-input-name").value,
            brand: document.getElementById("swal-input-brand").value,
            price: document.getElementById("swal-input-price").value,
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            category: document.getElementById("swal-input-category").value,
            section: document.getElementById("swal-input-section").value,
            details: document.getElementById("swal-input-category").value
          };
        },
        didOpen: () => {
          const imageInput = document.getElementById("swal-input-image");
          const imagePreview = document.getElementById("swal-image-preview");


          imageInput.addEventListener("change", () => {
            const file = imageInput.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
              };
              reader.readAsDataURL(file);
            } else {
              imagePreview.style.display = "none";
            }
          });
        }
      });

      if (formValues) {
        Swal.fire({
          title: 'Product Details',
          html: `
            <p><strong>Name:</strong> ${formValues.name}</p>
            <p><strong>Brand:</strong> ${formValues.brand}</p>
            <p><strong>Price:</strong> ${formValues.price}</p>
            <p><strong>Category:</strong> ${formValues.category}</p>
            <p><strong>Section:</strong> ${formValues.section}</p>
            <p><strong>Details:</strong> ${formValues.details}</p>
            ${formValues.image ? `<img src="${formValues.image}" alt="Product Image" style="max-width: 100%; height: auto;">` : ''}
          `
        });
      }

    } catch (error) {
      console.log(error);
    }
  }














  return (
    <>
      <div
        key={product.id}
        className="bg-white overflow-hidden shadow-lg rounded-lg"
      >
        <img
          className="w-full h-56 object-cover object-center"
          src={product.CandinateAvatar}
          alt={product.productName}
        />
        <div className="p-4">
          <p className="text-gray-900 font-semibold text-xl mb-2">
            {product.productName}
          </p>
          <p className="text-gray-700 text-base">${product.productPrice}</p>
          <div className="mt-4 flex justify-end">
            <button onClick={(e) => {
              EditProduct(product._id);
            }} className="mr-2">
              <Icon.PencilFill color="black" size={20} />
            </button>
            <button
              onClick={(e) => {
                DeleteProduct(product._id);
              }}
            >
              <Icon.TrashFill color="black" size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProdut;
