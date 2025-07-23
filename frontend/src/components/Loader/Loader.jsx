import React from "react";

const Loader = ({ show }) => {
  return (
    show && (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 ${
          show ? "z-50" : "hidden"
        }`}
      >
        {/* <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div> */}
        <div className="flex flex-row gap-2 text-center">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          {/* <h1 className="text-center w-4 h-4 px-4 m-4">Loading .....</h1> */}
        </div>
      </div>
    )
  );
};

export default Loader;
