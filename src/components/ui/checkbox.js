import React from "react";

export function Checkbox({ label, checked, onCheckedChange }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onCheckedChange} />
      <span>{label}</span>
    </label>
  );
}
