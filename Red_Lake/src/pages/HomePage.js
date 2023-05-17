import React from "react";
import ProductCard from "../components/ProductCard";
import Swiper from "../components/Swiper";
import Marquee from "react-fast-marquee";
import TopCategorys from "../components/TopCategorys";
import OurInsta from "../components/OurInsta";
import OurTrust from "../components/OurTrust";
import { Helmet } from "react-helmet-async";
import FaceCare from "../components/Categorys/FaceCare";
import SkinCare from "../components/Categorys/SkinCare";
import LipsCare from "../components/Categorys/LipsCare";
import MensSpecial from "../components/Categorys/MensSpecial";
import EyesCare from "../components/Categorys/EyesCare";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>The Silk Root</title>
      </Helmet>
      
      <Marquee className="bg-red-400 mt-24 text-white ">
        I can be a React component, multiple React components, or just some I
        can be a React component, multiple React components, or just some I can
        be a React component, multiple React components, or just some text.
      </Marquee>

      

      <ProductCard />

      {/* our insta */}

      
    </>
  );
};

export default HomePage;
