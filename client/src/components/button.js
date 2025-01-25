import React, { useState } from "react";

const Button = ({ text, onclick, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const buttonStyle = {
    display: "inline-block",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffffff",
    background: isHovered
      ? "linear-gradient(90deg, #0059b3, #00b3ff)" // Hover effect
      : "linear-gradient(90deg, #0078FF, #00D1FF)", // Normal state
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    boxShadow: isClicked
      ? "0 2px 4px rgba(0, 0, 0, 0.3)" // Click effect
      : "0 4px 6px rgba(0, 0, 0, 0.1)", // Normal shadow
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      onClick={onclick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
