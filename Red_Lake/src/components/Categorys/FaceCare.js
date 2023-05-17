import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
// import "swiper/swiper.min.css";
// import SliderArrow from "./SliderArrow";
import Slider from "react-slick";
import { useEffect, useReducer } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { BsArrowRightShort, BsFillCartFill } from "react-icons/bs";
import { getError } from "../../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { Store } from "../../Store";
import { useContext } from "react";
import axios from "axios";
import { MdRemoveShoppingCart } from "react-icons/md";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
       
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "",
        borderRadius: "25px",
        marginRight: "10px",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        borderRadius: "25px",
        marginLeft: "10px",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
      }}
      onClick={onClick}
    />
  );
}

const FaceCare = (props) => {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
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

  

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?&category=Face`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [ error]);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <>
      <div className="container mx-auto overflow-hidden py-2 lg:py-5 sm:py-2 px-5 lg:px-24 sm:px-5">
        <div class="flex justify-between ">
          <div>
            <h1 className="text-xl px-3 font-semibold md:text-3xl mt-10">
              FACE-CARE
            </h1>
          </div>
          <div className="">
            <Link to="/services">
              <p className="mt-10 px-3 text-sm lg:text-lg sm:text-sm inline-flex self-center">
                Show all
                <BsArrowRightShort className=" text-2xl " />
              </p>
            </Link>
          </div>
        </div>
        {!products || products.length === 0 ? (
          <MessageBox>No Product Found</MessageBox>
        ) : (
          <Slider
            {...settings}
            className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
          >
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox color="failure">{error}</MessageBox>
            ) : (
              products.map((product) => (
                <div
                  key={product.slug}
                  className="group relative px-3 lg:px-3 sm:px-3 "
                >
                  <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75 lg:aspect-none border-2 border-gray-200">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </Link>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/product/${product.slug}`}>
                          <span aria-hidden="true" className="absolute " />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.color}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      <strong>${product.price}</strong>
                    </p>
                  </div>
                  <div>
                    {product.countInStock === 0 ? (
                      <button className="mx- my-1 flex items-center bg-gray-100 transition duration-150 ease-in-out rounded border border-gray-300 text-gray-600 pl-2 pr-4 py-1 text-sm">
                        <span className="h-4 w-4 mr-2" disabled>
                          <MdRemoveShoppingCart />
                        </span>
                        Stock Out
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCartHandler(product)}
                        className="mx- my-1 flex items-center bg-gray-100 transition duration-150 ease-in-out hover:bg-gray-200 rounded border border-gray-300 text-gray-600 pl-2 pr-4 py-1 text-sm"
                      >
                        <span className="h-4 w-4 mr-2">
                          <BsFillCartFill />
                        </span>
                        Cart
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </Slider>
        )}
      </div>
    </>
  );
};

export default FaceCare;
