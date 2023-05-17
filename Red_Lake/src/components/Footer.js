import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="bg-white dark:bg-Slate-500 footerfix">
        <div className="bg-gray-200 py-4 "><p className="text-center self-center ">All &copy; Copyright {currentYear}, Breamz. All Rights Reserved</p></div>
      </footer>
    </>
  );
};

export default Footer;
