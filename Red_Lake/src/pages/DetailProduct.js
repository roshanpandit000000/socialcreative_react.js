import React, { useRef, useState } from "react";
// import CandiesGums from "../components/Categorys/Candies & Gums";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, ListGroup, Select } from "flowbite-react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";
import ProductCard from "../components/ProductCard";
import Rating from "../components/Rating";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const DetailProduct = () => {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [count, setCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox color="failure">{error}</MessageBox>
  ) : (
    <>
      {/* <!-- Description Div --> */}
      <Helmet>
        <title>{product.name}</title>
      </Helmet>

      <div className="md:flex items-start justify-center py-10 2xl:px-40 md:px-6 px-4 mt-20">
        <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
          <img
            src={product.image}
            alt={product.image}
            width={600}
            height={0}
            className="rounded-lg"
          />
        </div>
        <div className="md:hidden">
          <img
            src={product.image}
            alt={product.image}
            width={500}
            height={0}
            className="rounded-lg"
          />
        </div>
        <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
          <div className="border-b border-gray-200 pb-6 flex justify-between ...">
            <div className="">
              <h1
                className="
					lg:text-2xl
							text-xl
							font-semibold
							lg:leading-6
							leading-7
							text-gray-800
							mt-2
						"
              >
                {product.name}
              </h1>
            </div>
            <div className="">
              <button
                type="button"
                onClick={addToCartHandler}
                className="text-gray-800 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-6 py-2 mr-2 mb-2 border-2 border-gray-800"
              >
                Save
              </button>
            </div>
          </div>
          <div className="py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-base leading-4 text-gray-800">Category</p>
            <div className="flex items-center justify-center">
              <p className="text-sm leading-none text-gray-600 mr-5">
                {product.category}
              </p>
            </div>
          </div>
          <div className="py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-base leading-4 text-gray-800">Image Credit:</p>
            <div className="flex items-center justify-center">
              <Link
                to={product.brand}
                target="_blank"
                className="text-sm leading-none text-gray-600 mr-7 underline hover:text-blue-500"
              >
                {" "}
                <span>Original Image Source Link</span>
              </Link>
            </div>
          </div>

          <div>
            <p className="xl:pr-48 text-base lg:leading-tight leading-normal text-blue-600 mt-7">
              {product.description}
            </p>
            <p className="text-base leading-4 mt-7 text-gray-600">
              <Rating rating={product.rating} />
            </p>
            <p className="text-base leading-4 mt-4 text-gray-600">
              <Rating numReviews={product.numReviews} />
            </p>
          </div>
          <div>
            <div className="border-t border-b py-4 mt-7 border-gray-200">
              <div
                onClick={() => setShow(!show)}
                className="flex justify-between items-center cursor-pointer"
              >
                <p
                  ref={reviewsRef}
                  className="text-2xl font-semibold leading-4 text-gray-800"
                >
                  Comments
                </p>
                <button
                  className="
									cursor-pointer
									focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
									rounded
								"
                  aria-label="show or hide"
                >
                  <svg
                    className={
                      "transform " + (show ? "rotate-180" : "rotate-0")
                    }
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L5 5L1 1"
                      stroke="#4B5563"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div
                className={
                  "pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 " +
                  (show ? "block" : "hidden")
                }
                id="sect"
              >
                <div>
                  {product.reviews.length === 0 && (
                    <MessageBox>There is no Comments</MessageBox>
                  )}
                </div>
                <div>
                  <ListGroup>
                    {product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating rating={review.rating} caption=" "></Rating>
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </div>
            <div className="my-5">
              {userInfo ? (
                <form
                  className="flex items-center w-full"
                  onSubmit={submitHandler}
                >
                  <label for="simple-search" className="sr-only">
                    Write a customer review
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-4  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search"
                      required
                    />
                  </div>
                  <button
                    disabled={loadingCreateReview}
                    type="submit"
                    className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                    <span className="sr-only">Submit</span>
                  </button>
                  {loadingCreateReview && <LoadingBox></LoadingBox>}
                  <div>
                    <Select
                      required={true}
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1- Poor</option>
                      <option value="2">2- Fair</option>
                      <option value="3">3- Good</option>
                      <option value="4">4- Very good</option>
                      <option value="5">5- Excelent</option>
                    </Select>
                  </div>
                </form>
              ) : (
                <MessageBox>
                  Please{" "}
                  <Link to={`/signin?redirect=/product/${product.slug}`}>
                    Sign In
                  </Link>{" "}
                  to write a review
                </MessageBox>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      {/* /* // releted product */}
      <div className="container  mx-auto px-7 sm:px-7 lg:px-0">
        <p className="text-center text-4xl font-semibold mt-16">
          More like this
        </p>
      </div>
      <ProductCard />
    </>
  );
};

export default DetailProduct;
