import React from "react";

const CardItem = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition">
      {children}
    </div>
  );
};

export default CardItem;