
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import baseUrl from "../core";
import CartButton from "./CartButton";

const fetchArrivalProducts = async (query) => {
  const { data } = await axios.get(`${baseUrl}/api/v1/arrival-product/${query}`);
  return data;
};

const Arrival = (props) => {
  const { query } = props;

  const { data: products, error, isLoading } = useQuery(['arrivalProducts', query], () => fetchArrivalProducts(query), {
    cacheTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching products</div>;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="grid grid-cols-4 max-lg:grid-cols-2 max-xl:grid-cols-3 max-w-1050:grid-cols-1 max-md:grid-cols-2 max-sm:grid-cols-1 mt-10 place-items-center">
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
              <p className="text-gray-700 text-base">${product.productPrice}</p>
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
  );
};

export default Arrival;
