import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/config";
import "../pageStyles/LoginPage.css";
import { GraduationCap, UserPen } from "lucide-react";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);

  const handleLogin = async (role) => {
    try {
      setLoadingRole(role);
      await signInAnonymously(auth);
      console.log(`Signed in as ${role}`);
      onLogin(role);
      navigate(role === "teacher" ? "/teacher" : "/student");
    } catch (error) {
      console.error("Error in signing in:", error);
      alert("Failed to sign in. Please try again.");
      setLoadingRole(null);
    }
  };

  return (
    <>
      <main className="container loginContainer">
        <article>
          <h1 align="center">QuizTick</h1>
          <p align="center">Please sign-in to move further</p>
          <div>
            <button
              onClick={() => handleLogin("teacher")}
              disabled={loadingRole}
            >
              <UserPen className="pico-icon" />
              {loadingRole === "teacher"
                ? "Signing In..."
                : "Sign in as Teacher"}
            </button>
            <button
              onClick={() => handleLogin("student")}
              disabled={loadingRole}
            >
              <GraduationCap className="pico-icon" />
              {loadingRole === "student"
                ? "Signing In..."
                : "Sign in as Student"}
            </button>
          </div>
        </article>
      </main>
    </>
  );
};

export default Login;
