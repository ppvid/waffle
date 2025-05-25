import React from "react";

export function Button({ children, className = "", onClick, variant = "default" }) {
  const base = "px-4 py-2 rounded text-white font-bold";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700",
    outline: "bg-white border border-gray-400 text-gray-700 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
