import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Login from "./pages/LoginPage";
import TeacherLayout from "./pages/teacherView/TeacherLayout";
import TeacherDashboard from "./pages/teacherView/TeacherDashboard";
import CreateTest from "./pages/teacherView/CreateTest";
import QuestionBank from "./pages/teacherView/QuestionBank";

import StudentLayout from "./pages/studentView/StudentLayout";
import StudentDashboard from "./pages/studentView/StudentDashboard";

function App() {
  const [role, setRole] = useState("");

  const onLogin = (role) => {
    setRole(role);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={onLogin} />}></Route>

          <Route path="/teacher" element={<TeacherLayout role={role} />}>
            <Route index element={<TeacherDashboard />}></Route>
            <Route path="question-bank" element={<QuestionBank />}></Route>
            <Route path="/teacher/create-test" element={<CreateTest />}></Route>
          </Route>

          <Route path="/student" element={<StudentLayout role={role} />}>
            <Route index element={<StudentDashboard />}></Route>
            <Route path="question-bank" element={<QuestionBank />}></Route>
            <Route path="/student/create-test" element={<CreateTest />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
