import React from "react";
import { useState, useEffect } from "react";
import "@theme-toggles/react/css/Within.css"
import { Within } from "@theme-toggles/react"
import "../componentStyles/ThemeButton.css"

function ThemeButton() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };
  return (
    <>
      <Within duration={500} reversed onToggle={toggleTheme} className="btn-theme"/>
    </>
  );
}

export default ThemeButton;
