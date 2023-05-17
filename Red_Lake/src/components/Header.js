import React from "react";
import { BsCartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dropdown } from "flowbite-react";
import SearchBox from "./SearchBox";
import CaregorySection from "./CaregorySection";

const NavBar = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/login";
  };
  return (
    <>
      <ToastContainer position="bottom-center" limit={1} />
      <nav className="bg-gradient-to-r from-gray-100 to-red-700 dark:bg-gray-700 w-full fixed  z-40 top-0">
        <div className="container flex justify-between ... mx-auto ">
          <div className="flex items-center pr-10">
            <Link to="/">
              <span className="self-center text-md font-semibold whitespace-nowrap text-white pt-1 sm:text-md lg:text-xl ">
                <h2 className="hidden sm:block text-2xl font-bold leading-normal pl-">
                  <span className="text-red-800">Social</span>
                  <span className="text-gray-800"> Creative</span>
                </h2>
              </span>

              {/* Search */}
            </Link>
          </div>
          {/* search box */}
          <div className="w-full mb-2">
            <SearchBox />
          </div>
          <div className="flex items-center pl-10">
            <Link
              to="/cart"
              className="mr-6 text-lg font-medium text-white dark:text-white hover:underline"
            >
              <BsCartFill />
              {cart.cartItems.length > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white absolute">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </Link>
            {userInfo ? (
              <div className="text-sm font-medium text-white dark:text-blue-500 hover:underline text-center pl-3">
                <Dropdown label={userInfo.name} inline={true}>
                  <Link to="/profile">
                    <Dropdown.Item>User Profile</Dropdown.Item>
                  </Link>
                  <Link to="/orderhistory">
                    <Dropdown.Item>Order History</Dropdown.Item>
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    <Dropdown.Item>Sign out</Dropdown.Item>
                  </Link>
                </Dropdown>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-white dark:text-blue-500 hover:underline"
              >
                Login
              </Link>
            )}
            <div className="pl-5 text-white">
              {userInfo && userInfo.isAdmin && (
                <Dropdown label="Admin" inline={true}>
                  <Link to="/admin/dashboard">
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                  </Link>
                  <Link to="/admin/products">
                    <Dropdown.Item>Products</Dropdown.Item>
                  </Link>
                  <Link to="/admin/orders">
                    <Dropdown.Item>Order</Dropdown.Item>
                  </Link>
                  <Link to="/admin/users">
                    <Dropdown.Item>Users</Dropdown.Item>
                  </Link>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* <!-- drawer init and toggle --> */}
    </>
  );
};

export default NavBar;
