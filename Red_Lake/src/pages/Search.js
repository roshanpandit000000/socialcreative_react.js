import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getError } from "../utils";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { useContext } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "रु1 to रु50",
    value: "1-50",
  },
  {
    name: "रु51 to रु200",
    value: "51-200",
  },
  {
    name: "रु201 to रु1000",
    value: "201-1000",
  },
];

const Search = (props) => {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const [showFilters, setShowfilters] = useState(true);
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&order=${order}`
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
  }, [category, error, order, page, price, query]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <>
      <div className="container py-10 mx-auto px-7 sm:px-7 lg:px-0 mt-20 ">
        <div className="py-5">
          <p className=" cursor-pointer hover:underline duration-100 font-normal text-base leading-4 text-gray-600">
            {countProducts === 0 ? "No" : countProducts} Results
            {query !== "all" && " : " + query}
            {category !== "all" && " : " + category}
            {price !== "all" && " : Price " + price}
            {query !== "all" || category !== "all" || price !== "all" ? (
              <button variant="light" onClick={() => navigate("/search")}>
                <i className="fas fa-times-circle"></i>
              </button>
            ) : null}
          </p>
        </div>
        {!products || products.length === 0 ? (
          <MessageBox>No Product Found</MessageBox>
        ) : (
          // render your products here

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
                        <p className="text-base font-medium text-clip overflow-hidden text-gray-700">
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
        )}

        <div className=" flex justify-center items-center mt-16">
          {[...Array(pages).keys()].map((x) => (
            <Link
              key={x + 1}
              className="mx-3 border border-gray-500 bg-gray-100 shadow-md px-4 rounded-lg py-2"
              to={getFilterUrl({ page: x + 1 })}
            >
              <button
                className={Number(page) === x + 1 ? "text-bold" : ""}
                variant="light"
              >
                {x + 1}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Search;
