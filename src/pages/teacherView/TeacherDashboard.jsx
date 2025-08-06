import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase/config.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import LoaderComponent from "../../components/LoaderComponent.jsx";
import "../../pageStyles/teacherViewStyles/TeacherDashboard.css";

const DashboardContent = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDeleteTest = async (testId) => {
    if (
      window.confirm("Are you sure you want to delete this test permanently?")
    ) {
      try {
        const docToDelete = doc(db, "tests", testId);
        await deleteDoc(docToDelete); //delete from firestore

        const newTestSet = tests.filter((test) => test.id !== testId);
        setTests(newTestSet); //delete from dashboard if successfully deleted from firestore
      } catch (error) {
        console.error("Error in deleting test: ", error);
      }
    }
  };

  const handleEditTest = (testObject) => {
    navigate("/teacher/create-test", { state: { testToEdit: testObject } });
  };

  const handleShareTest = async (testId) => {
    const base_URL = window.location.origin;
    const path = `/test/${testId}`;
    const share_link = base_URL + path;

    try{
      await navigator.clipboard.writeText(share_link);
      alert("Test link copied to clipboard");
    }
    catch(error){
      console.error("Error in copying link: ", error);
      alert("Error in copying test link");
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(db, "tests"),
            where("teacherId", "==", user.uid)
          );
          const qSnapshot = await getDocs(q);

          const fetchedTestsData = qSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTests(fetchedTestsData);
        }
      } catch (error) {
        console.error("Error in fetching data: ", error);
        alert("Failed to fetch tests");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <div className="dashboardContainer">
        <h3 className="heading">All Tests</h3>

        <div className="test-list">
          {tests.length === 0 ? (
            <p>No tests created</p>
          ) : (
            tests.map((test) => (
              <div key={test.id} className="test-card">
                <div className="test-card-header">
                  <h3>{test.title}</h3>
                  <p>{test.teacherId}</p>
                </div>

                <div className="test-card-body">
                  <p>
                    Time Limit:{" "}
                    {test.timer > 0 ? `${test.timer} minutes` : "None"}
                  </p>
                  <p>Number of questions: {test.questions?.length || 0}</p>
                  {test.createdAt && (
                    <p>
                      Created: {test.createdAt.toDate().toLocaleDateString()}
                    </p>
                  )}

                  <div className="test-card-actions">
                    <button>View Results</button>
                    <button onClick={() => handleEditTest(test)}>Edit</button>
                    <button onClick={() => handleDeleteTest(test.id)}>
                      Delete
                    </button>
                    <button onClick={() => handleShareTest(test.id)}>
                      Share Link
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
