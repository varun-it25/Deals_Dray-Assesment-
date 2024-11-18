import React from "react";

const Error = ({ error }) => {
  if (error)
    return (
      <div className="w-96 p-4 bg-red-500 text-white rounded-lg mb-4">
        <p className="text-lg font-semibold">Login Failed</p>
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
};

export default Error;
