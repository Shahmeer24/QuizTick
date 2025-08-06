import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import "../../pageStyles/studentViewStyles/StudentLayout.css";
import {
  CircleUserRound,
  BookCheck,
  ClipboardCheck,
  Plus,
  LogOut,
} from "lucide-react";

import ThemeButton from "../../components/ThemeButton";

function StudentLayout({ role }) {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/"); //navigate to sign-in page
    } catch (error) {
      console.error("SignOut Error: ", error);
    }
  };
  //student Layout
  return (
    <div className="studentLayout">
      <nav className="section-left">
        <div>
          <div>
            <h2 className="primary-heading">Logo(update this)</h2>
          </div>
          <div>
            <ul className="nav-btns">
              <li>
                <Link to="/student/create-test">
                  <Plus className="pico-icon" />
                  Create New Test
                </Link>
              </li>
              <li>
                <Link to="/student">
                  <ClipboardCheck className="pico-icon" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/student/question-bank">
                  <BookCheck className="pico-icon" />
                  Question Bank
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <CircleUserRound />
          <h4 className="primary-heading">
            {auth.currentUser?.email || auth.currentUser?.uid}
          </h4>
          <a className="btn btn-signOut" onClick={handleSignOut}>
            <LogOut className="pico-icon" />
            Sign Out
          </a>
          <ThemeButton className="btn" />
        </div>
      </nav>
      <main className="section-right">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
