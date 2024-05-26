import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../core";
import CartButton from "../components/CartButton";
import { useQuery, useQueryClient, useMutation } from "react-query";

const SingleProduct = () => {
  const { data: products, isLoading, isError } = useQuery(
    "products",
    async () => {
      const response = await axios.get(`${baseUrl}/api/v1/allproducts`);
      return response.data;
    }
  );

  const queryClient = useQueryClient();

  const addToCartMutation = useMutation(
    async (product) => {
      const response = await axios.post(`${baseUrl}/api/v1/cart`, product);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cart"); // Invalidate cart query to trigger a refetch
      },
    }
  );

  const handleAddToCart = async (product) => {
    try {
      await addToCartMutation.mutateAsync(product);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error fetching data</div>
      ) : (
        <div className="min-h-screen w-full">
          <div className="grid grid-cols-4  max-lg:grid-cols-2 max-xl:grid-cols-3 max-w-1050:grid-cols-1 max-md:grid-cols-2 max-sm:grid-cols-1 mt-10 place-items-center">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white mt-10 w-72 h-[60vh] m-2 overflow-hidden shadow-lg rounded-lg"
              >
                <Link className="-z-0" to={`/product/${product._id}`}>
                  <img
                    className="w-full h-[60%] object-fill object-center"
                    src={product.CandinateAvatar}
                    alt={product.productName}
                  />
                </Link>
                <div className="p-4 h-[40%]">
                  <p className="text-gray-900 font-semibold text-xl mb-2">
                    {product.productName}
                  </p>
                  <p className="text-gray-700 text-base">
                    ${product.productPrice}
                  </p>
                  <div className="mt-1 flex justify-end">
                    <CartButton
                      item={{
                        productName: product.productName,
                        CandinateAvatar: product.CandinateAvatar,
                        productPrice: product.productPrice,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
