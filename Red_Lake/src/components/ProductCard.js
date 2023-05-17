import React, { useContext } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
// import "swiper/swiper.min.css";
// import SliderArrow from "./SliderArrow";
import Slider from "react-slick";
import { useEffect, useReducer, useState } from "react";
import logger from "use-reducer-logger";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductCard = (props) => {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    
    
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: "",
  });
  // const [product, setProduct] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="container py-10 mx-auto px-7 sm:px-7 lg:px-10 md:px-10 xl:px-10 ">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5  xl:grid-cols-6 gap-6">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox color="failure">{error}</MessageBox>
          ) : (
            products.map((product) => (
              <div className="grid gap-4">
                <div className=" " key={product.slug}>
                  <div className="relative group ">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={0}
                        className="rounded-lg group-hover:brightness-50 "
                      />
                      <p className="text-base font-medium text-gray-700 truncate">
                        {" "}
                        {product.name}...{" "}
                      </p>
                    </Link>
                    <div className="absolute text-2xl text-blue-300 top-2 right-1  opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => addToCartHandler(product)}
                        type="button"
                        className="text-white hover:text-gray-800 hover:bg-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2 mr-2 mb-2 border-2 border-white"
                      >
                        Save
                      </button>
                    </div>
                    <div className="absolute text-2xl text-blue-300 bottom-9 left-2  opacity-0 group-hover:opacity-100">

                      <Link to={product.brand} target="_blank"
                        
                        className="text-white hover:text-gray-800 hover:bg-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-1 mr-2 mb-2 border-2 border-white"
                      >
                        Link
                      </Link>
                    </div>
                    <div className="absolute text-xl text-white hover:text-gray-800 border-white border-2 bottom-9 right-3 opacity-0 group-hover:opacity-100 hover:bg-white rounded-full p-1">
                      <Link href={product.slug}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
