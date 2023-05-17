import React, { useState } from "react";
import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import { Link } from "react-router-dom";
import {
  AiFillDelete,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Index() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <div className="container py-10 mx-auto px-7 sm:px-7 lg:px-0 pt-32 ">
        <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto  ">
          <div className="text-center text-6xl text-gray-800 pt-7">R</div>
        </div>
        <p className="text-center text-gray-800 text-4xl font-semibold">
          Roshan Pandit
        </p>
        <p className=" mb-10 text-center text-gray-700 text-sm font-normal ">
          roshanpandit@gmail.com
        </p>
        {cartItems.length === 0 ? (
          <MessageBox>
            Cart is empty. <Link to="/">Go Shopping</Link>
          </MessageBox>
        ) : (
          <div class="grid grid-cols-2 md:grid-cols-6 gap-6 mt-24">
            {cartItems.map((item) => (
              <React.Fragment key={item._id}>
                <div class="grid gap-4">
                  <div className=" ">
                    <div className="relative overflow-hidden group ">
                      <Link to={`/product/${item.slug}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          width={400}
                          height={0}
                          className="rounded-lg group-hover:brightness-50 "
                        />
                        <p className="text-base font-semibold text-gray-700">
                          {" "}
                          {item.name}{" "}
                        </p>
                      </Link>
                      <div className="absolute text-2xl text-blue-300 top-2 right-1  opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => removeItemHandler(item)}
                          type="button"
                          className="text-white hover:text-gray-800 hover:bg-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2 mr-2 mb-2 border-2 border-white"
                        >
                          remove
                        </button>
                      </div>
                      <div className="absolute text-2xl text-white bottom-8 right-2 opacity-0 group-hover:opacity-100">
                        <Link href={item.slug}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-9 h-9"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute text-2xl text-blue-300 top-2 right-1  opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => removeItemHandler(item)}
                    type="button"
                    className="text-white hover:text-gray-800 hover:bg-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2 mr-2 mb-2 border-2 border-white"
                  >
                    remove
                  </button>
                </div>
                <div className="absolute text-2xl text-white bottom-8 right-2 opacity-0 group-hover:opacity-100">
                  <Link href={item.slug}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-9 h-9"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Link>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Index;
