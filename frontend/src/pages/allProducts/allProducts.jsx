import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import baseUrl from "../../core";
import axios from "axios";
import { Radio, Checkbox } from "antd";
import { Prices } from "../../components/priceList";
import CartButton from "../../components/CartButton";
import { useQuery } from "react-query"; // Add useQuery

const Allprodcuts = () => {
  const [category, setCategorys] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);

  // Fetch categories using useQuery
  const { data: categoryData } = useQuery("categories", async () => {
    const response = await axios.get(`${baseUrl}/api/v1/categorys`);
    return response.data;
  });

  useEffect(() => {
    if (categoryData) {
      setCategorys(categoryData);
    }
  }, [categoryData]);

  // Fetch products using useQuery
  const { data: productData } = useQuery(["products", checked, radio], async () => {
    const response = await axios.post(`${baseUrl}/api/v1/filter-product`, {
      radio,
      checked,
    });
    return response.data.products;
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row relative">
        <div className="h-[80vh] bottom-0 border-r  border-gray  mt-10 w-full lg:w-[300px] lg:fixed max-lg::items-end max-lg::justify-end  max-lg:bg-black/40 lg:left-0 bg-white">
          <h1 className="px-5 pb-2 font-semibold text-[20px]">Filtered By Category</h1>
          <div className="checkbox px-5 grid bg-fuchsia-400 text-[16px] grid-cols-3 mt-10 ">
            {category?.length ? (
              category.map((c) => (
                <Checkbox
                  key={c._id}
                  value={c.category}
                  onChange={(e) => {
                    setChecked((prevChecked) => {
                      const all = [...prevChecked];
                      if (e.target.checked && !all.includes(c.category)) {
                        all.push(c.category);
                      } else if (!e.target.checked && all.includes(c.category)) {
                        const index = all.indexOf(c.category);
                        all.splice(index, 1);
                      }
                      return all;
                    });
                  }}
                >
                  {c.category}
                </Checkbox>
              ))
            ) : (
              <div className="h-full w-full flex justify-center items-center py-10">
                <h1 className="text-2xl font-bold">NO CATEGORY</h1>
              </div>
            )}
          </div>

          <div className="w-full px-4">
            <h1 className="py-2 font-semibold text-[20px]">Filter By Price</h1>
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        </div>

        <div className="w-full lg:ml-[300px] flex justify-evenly items-center mt-4 lg:mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7 m-5 place-items-center">
            {productData?.length ? (
              productData.map((product) => (
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
              ))
            ) : (
              <div className="w-full text-center h-96 flex justify-center items-center">
                <h1 className="text-1xl font-bold">
                  Search No Result <br />
                  We're sorry. We cannot find any matches for your search term.
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default Allprodcuts;
