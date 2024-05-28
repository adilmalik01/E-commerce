import { Link } from "react-router-dom";
import baseUrl from "../../../core";
import axios from "axios";

const AdminNavbar = () => {
  let styles = {
    style1:
      "text-xl flex items-center transition-all duration-700  justify-center  hover:bg-gray-600 hover:text-white  h-16 mt-5 rounded-tl-none rounded-bl-none rounded-full font-semibold w-11/12 bg-white text-black",
  };

  return (
    <>
      <div className="h-screen fixed overflow-auto left-0 w-1/5 bg-white border-r border-black/50 ">
        <div className="w-full h-32 flex justify-center items-center ">
          <h1 className=" font-semibold text-5xl">Invento</h1>
        </div>
        <div className="w-full h-82 flex justify-center items-start flex-col">
          <Link
            className=" text-xl text-center flex transition-all duration-700 items-center justify-center  hover:bg-gray-600 hover:text-white  h-16 mt-5 rounded-tl-none rounded-bl-none rounded-full  font-semibold w-11/12 bg-white text-blac"
            to={"/"}
          >
            Dashboard
          </Link>
          <Link className={styles.style1} to={"/newproduct"}>
            Add Product
          </Link>
          <Link className={styles.style1} to={"/category"}>
            Catergory
          </Link>
          <Link className={styles.style1} to={"/veiwproducts"}>
            Veiw Products
          </Link>
          <Link className={styles.style1} to={"/allorders"}>
            All Orders
          </Link>
          <Link className={styles.style1} to={"/allusers"}>
            All Users
          </Link>
          <div
            onClick={async () => {
              try {
                const response = await axios.post(`${baseUrl}/api/v1/logout`);
                if (response.status === 200) {
                  window.location.reload();
                }
              } catch (error) {
                console.log(error);
              }
            }}
            className=" text-xl  flex items-center transition-all duration-700  justify-center hover:bg-gray-600 hover:text-white  h-16 mt-5 rounded-tl-none rounded-bl-none rounded-full font-semibold w-11/12 bg-white text-black"
            to={"/veiwproducts"}
          >
            Logout
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
