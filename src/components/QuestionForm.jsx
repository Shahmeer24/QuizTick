import React, { useState, useEffect } from "react";
import { Trash, ListRestart, Plus, Save } from "lucide-react";
import "../componentStyles/QuestionForm.css";

const blankQuestion = {
  text: "",
  type: "radio",
  options: ["", ""],
  correctAnswer: "",
  points: 0,
};

const QuestionForm = ({ onSave, editQ }) => {
  const [questionData, setQuestionData] = useState(blankQuestion);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "type" && value === "checkbox") {
      setQuestionData({ ...questionData, [name]: value, correctAnswer: [] });
    } else if (name === "type" && value === "radio") {
      setQuestionData({ ...questionData, [name]: value, correctAnswer: "" });
    } else if (name === "points") {
      const points = parseInt(value, 10);
      if (points < 0) {
        points = 0;
      }
      setQuestionData({ ...questionData, points: isNaN(points) ? 0 : points });
    } else {
      setQuestionData({ ...questionData, [name]: value });
    }
  };

  const handleOptionTextChange = (text, index) => {
    const newOptions = [...questionData.options];
    newOptions[index] = text;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...questionData.options, ""];
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleDeleteOption = (index) => {
    const newOptions = questionData.options.filter((_, i) => i !== index);
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleCorrectAnswerChange = (option) => {
    if (questionData.type === "radio") {
      setQuestionData({ ...questionData, correctAnswer: option });
    } else {
      const currentAnswers = questionData.correctAnswer;
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter((ans) => ans !== option)
        : [...currentAnswers, option];
      setQuestionData({ ...questionData, correctAnswer: newAnswers });
    }
  };

  const handleResetForm = () => {
    setQuestionData(blankQuestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(questionData);
    handleResetForm();
  };

  useEffect(() => {
    if (editQ) {
      setQuestionData(editQ);
    } else {
      setQuestionData(blankQuestion);
    }
  }, [editQ]);

  return (
    <div className="form-input">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <h3 className="secondary-heading">Question Form</h3>
          <div className="form-actions">
            <button className="btn-action" type="submit">
              <Save className="pico-icon" /> Save Question
            </button>
            <button
              className="btn-action"
              type="button"
              onClick={handleResetForm}
            >
              <ListRestart className="pico-icon" /> Reset Form
            </button>
          </div>
        </div>

        <textarea
          id="question-text"
          name="text"
          value={questionData.text}
          placeholder="Enter Question Text"
          onChange={handleInputChange}
          required
        />

        <select
          id="question-type"
          name="type"
          value={questionData.type}
          onChange={handleInputChange}
        >
          <option value="radio">Single Answer</option>
          <option value="checkbox">Multiple Answers</option>
        </select>

        <input
          type="number"
          id="question-points"
          value={questionData.points}
          name="points"
          placeholder="Enter Question Score"
          onChange={handleInputChange}
          title="Question Score"
        />

        <div className="options-container">
          <h4 className="secondary-heading">
            Create Options - Check the box for the correct option(s)
          </h4>
          <button type="button" id="btn-addOption" onClick={handleAddOption}>
            <Plus className="pico-icon" /> Add New Option
          </button>
          {questionData.options.map((optionText, index) => (
            <div key={index} className="option-item">
              <input
                type={questionData.type}
                name={`correctAnswer-${questionData.type}`}
                title="Select as Correct Option"
                checked={
                  questionData.type === "radio"
                    ? questionData.correctAnswer === optionText
                    : Array.isArray(questionData.correctAnswer) &&
                      questionData.correctAnswer.includes(optionText)
                }
                onChange={() => handleCorrectAnswerChange(optionText)}
              />
              <input
                type="text"
                id="option-text"
                value={optionText}
                onChange={(e) => handleOptionTextChange(e.target.value, index)}
                placeholder={`Option ${index + 1}`}
                required
              />
              <button
                type="button"
                className="form-btn"
                title="Delete Option"
                onClick={() => handleDeleteOption(index)}
              >
                <Trash className="pico-icon" />
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
