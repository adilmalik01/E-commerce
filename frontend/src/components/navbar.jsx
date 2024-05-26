import { useContext } from "react";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/context";

const Navbar = () => {
  let { state } = useContext(GlobalContext);
  console.log(state);
  let parseing = JSON.parse(localStorage.getItem("cart")) || [];
  return (
    <>
      <header className="w-full fixed top-0  h-32 flex-1  bg-white  flex  z-[1] justify-around items-center">
        <div className=" w-4/5 h-full bg-white flex items-center justify-evenly">
          <div className="">
            <img
              src="https://codsoft-landing-page-adil.netlify.app/images/uniqlo_medium.png"
              alt=""
            />
          </div>

          <nav>
            <ul className="list-none flex justify-aroud items-center ">
              <li className="m-4 text-gray-500 cursor-pointer text-lg font-semibold">
                <Link to={"/"}>Home</Link>
              </li>
              <li className="m-4 text-gray-500 cursor-pointer text-lg font-semibold">
                <Link to={"/products"}>Product</Link>
              </li>
              <li className="m-4 cursor-pointer text-gray-500  text-lg font-semibold">
                <Link to={"/about"}>About</Link>
              </li>
              <li className="m-4 cursor-pointer text-gray-500  text-lg font-semibold">
                <Link to={"/contact"}>Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="flex">
            <div className="icons  flex justify-around  gap-4  items-center ">
              <button className="text-gray-500">
                <Icon.Search color="black" size={20} />
              </button>

              <Link
                className="flex justify-center text-gray-500 items-center"
                to={"/cart"}
              >
                <button
                  type="button"
                  className="relative inline-flex items-center p-1 text-sm font-medium text-centerrounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <Icon.Cart size={20} />
                  <span className="sr-only">Notifications</span>
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
                    {`${parseing.length}`}
                  </div>
                </button>
              </Link>

              {state.isLogin ? (
                <div className="circle cursor-pointer rounded-full h-10 w-10">
                  <Link
                    className="circle cursor-pointer bg-black rounded-full "
                    to={"/profile"}
                  >
                    <img
                      className=" rounded-full h-full w-full  object-cover"
                      src={state.user.avatar}
                      alt=""
                    />
                  </Link>
                </div>
              ) : (
                <button className="text-gray-500">
                  <Link to={"/login"}>
                    <Icon.Person color="black" size={20} />
                  </Link>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
