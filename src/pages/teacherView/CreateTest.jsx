import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import "../../pageStyles/teacherViewStyles/CreateTest.css";
import QuestionForm from "../../components/QuestionForm";
import LoaderComponent from "../../components/LoaderComponent.jsx";
import { Eye, Import } from "lucide-react";

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [timer, setTimer] = useState(0);
  // const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const testToEdit = location.state?.testToEdit; // gets the object of the test to edit (if any)

  const handleSaveQuestion = (q) => {
    if (!editQuestion) {
      //add new question
      const newQuestion = { ...q, id: Date.now() };
      setQuestions([...questions, newQuestion]);
    } else {
      //update an existing question
      const updatedQuestion = questions.map((existingQuestion) => {
        if (existingQuestion.id === editQuestion.id) {
          return q;
        }
        return existingQuestion;
      });
      setQuestions(updatedQuestion);
      setEditQuestion(null);
    }
  };

  const handleDeleteQuestion = (id) => {
    const newQuestions = questions.filter((question) => question.id !== id);
    setQuestions(newQuestions);
  };

  const handleEditQuestion = (question) => {
    setEditQuestion(question);
  };

  const handleSaveTest = async () => {
    if (title.trim() === "") {
      alert("Please enter a test title.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question to the test.");
      return;
    }

    setIsSaving(true);
    const testData = {
      title,
      timer,
      questions,
    };
    try {
      if (testToEdit) {
        const testDocRef = doc(db, "tests", testToEdit.id);
        await updateDoc(testDocRef, testData);
        alert("Test updated successfully!");
      } else {
        const newTestData = {
          ...testData,
          teacherId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, "tests"), newTestData);
        alert("Test saved successfully!");
      }

      navigate("/teacher");
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    try {
      if (testToEdit) {
        setTitle(testToEdit.title);
        setTimer(testToEdit.timer);
        setQuestions(testToEdit.questions);
      }
    } catch (error) {
      console.error("Error in opening page: ", error);
      alert("Something wrong happend! Please try again.");
    } finally {
      setLoading(false);
    }
  }, [testToEdit]);

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <div className="main-container">
        <header className="header-container">
          <div className="btn-container" title="Preview Test">
            <button id="btn-preview">
              <Eye />
            </button>
          </div>
          <div className="btn-container">
            <button onClick={handleSaveTest} disabled={isSaving}>
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Import className="pico-icon" />
                  Save Test
                </>
              )}
            </button>
          </div>
        </header>
        <div className="primary-container">
          <section className="card-list">
            <input
              type="text"
              required
              id="title-input"
              placeholder="*Test Title"
              className="input-ele"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Duration (in mins)"
              className="input-ele"
              value={timer}
              onChange={(e) => setTimer(parseInt(e.target.value, 10) || 0)}
              title="Duration"
            />
            {/* <input
              type="text"
              id="name-input"
              placeholder="Creator Name"
              className="input-ele"
              value={name}
              onChange={(e) => setName(e.target.value)}
            /> */}

            <h3>Questions List</h3>
            <div className="card-item-list">
              {questions.length === 0 ? (
                <p>No questions have been added yet.</p>
              ) : (
                questions.map((question, index) => (
                  <div key={question.id} className="card-item">
                    <div className="card-text">
                      <strong>{index + 1}</strong>. <br />
                      <p id="card-question-text">{question.text}</p> <br />
                      <p>Score: {question.points}</p>
                    </div>
                    <div className="card-actions">
                      <button
                        className="card-btn"
                        type="button"
                        onClick={() => handleEditQuestion(question)}
                      >
                        Edit
                      </button>
                      <button
                        className="card-btn"
                        type="button"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          <div className="vertical-line"></div>

          <aside className="form-container">
            <QuestionForm onSave={handleSaveQuestion} editQ={editQuestion} />
          </aside>
        </div>
      </div>
    </>
  );
};

export default CreateTest;
