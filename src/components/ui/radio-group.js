import React from "react";

export function RadioGroup({ value, onValueChange, children }) {
  return <div className="space-y-2">{React.Children.map(children, child => {
    return React.cloneElement(child, { selected: value, onChange: onValueChange });
  })}</div>;
}

export function RadioGroupItem({ value, label, selected, onChange }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        checked={selected === value}
        onChange={() => onChange(value)}
      />
      <span>{label}</span>
    </label>
  );
}
