import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveQuiz } from "../redux/quizActions.js";

function CreateQuiz() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = (e) => {
    e.preventDefault();

    const cleanQuestion = question.trim();
    const options = [
      optionA.trim(),
      optionB.trim(),
      optionC.trim(),
      optionD.trim(),
    ];

    if (
      cleanQuestion.length < 10 ||
      cleanQuestion.length > 200
    ) {
      alert("Question must be between 10 and 200 characters.");
      return;
    }

    if (options.some((option) => !option)) {
      alert("Please fill in all four options.");
      return;
    }

    if (new Set(options).size !== options.length) {
      alert("All four options must be different.");
      return;
    }

    if (!options.includes(correctAnswer)) {
      alert("Please select a valid correct answer.");
      return;
    }

    setQuestions((previousQuestions) => [
      ...previousQuestions,
      {
        question: cleanQuestion,
        options,
        correctAnswer,
      },
    ]);

    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");

    alert("Question added successfully!");
  };

  const createQuiz = () => {
    const cleanTitle = title.trim();

    if (
      cleanTitle.length < 10 ||
      cleanTitle.length > 30
    ) {
      alert("Quiz title must be between 10 and 30 characters.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    try {
      const result = dispatch(
        saveQuiz({
          title: cleanTitle,
          questions,
        })
      );

      if (result && result.success) {
        alert("Quiz created successfully!");
        navigate("/my-quizzes");
      } else {
        alert("Could not save the quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Could not save the quiz. Please try again.");
    }
  };

  return (
    <div className="create-quiz-page">
      <header className="create-quiz-header">
        <div>
          <span className="cq-eyebrow">
            BUILD SOMETHING GREAT
          </span>
          <h1>Create a Quiz 📝</h1>
          <p>
            Write questions, add options, and test your knowledge.
          </p>
        </div>

        <button
          type="button"
          className="cq-btn cq-back"
          onClick={() => navigate("/home")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="cq-main">
        <section className="cq-form-card">
          <div className="cq-section-title">
            <span className="cq-section-icon">📋</span>
            <div>
              <h2>Quiz Details</h2>
              <p>Start by giving your quiz a title.</p>
            </div>
          </div>

          <label className="cq-label" htmlFor="quiz-title">
            Quiz Title (10–30 characters)
          </label>

          <input
            id="quiz-title"
            className="cq-input"
            type="text"
            minLength={10}
            maxLength={30}
            placeholder="e.g. General Knowledge"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="cq-divider" />

          <div className="cq-section-title">
            <span className="cq-section-icon">💡</span>
            <div>
              <h2>Add a Question</h2>
              <p>
                Provide four different options and select the correct answer.
              </p>
            </div>
          </div>

          <form onSubmit={addQuestion}>
            <label className="cq-label" htmlFor="question">
              Question {questions.length + 1} (10–200 characters)
            </label>

            <textarea
              id="question"
              className="cq-input cq-textarea"
              minLength={10}
              maxLength={200}
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <div className="cq-options-grid">
              <div>
                <label className="cq-label" htmlFor="option-a">
                  Option A
                </label>
                <input
                  id="option-a"
                  className="cq-input"
                  maxLength={100}
                  placeholder="Enter option A"
                  value={optionA}
                  onChange={(e) => {
                    setOptionA(e.target.value);
                    if (correctAnswer === optionA) {
                      setCorrectAnswer("");
                    }
                  }}
                />
              </div>

              <div>
                <label className="cq-label" htmlFor="option-b">
                  Option B
                </label>
                <input
                  id="option-b"
                  className="cq-input"
                  maxLength={100}
                  placeholder="Enter option B"
                  value={optionB}
                  onChange={(e) => {
                    setOptionB(e.target.value);
                    if (correctAnswer === optionB) {
                      setCorrectAnswer("");
                    }
                  }}
                />
              </div>

              <div>
                <label className="cq-label" htmlFor="option-c">
                  Option C
                </label>
                <input
                  id="option-c"
                  className="cq-input"
                  maxLength={100}
                  placeholder="Enter option C"
                  value={optionC}
                  onChange={(e) => {
                    setOptionC(e.target.value);
                    if (correctAnswer === optionC) {
                      setCorrectAnswer("");
                    }
                  }}
                />
              </div>

              <div>
                <label className="cq-label" htmlFor="option-d">
                  Option D
                </label>
                <input
                  id="option-d"
                  className="cq-input"
                  maxLength={100}
                  placeholder="Enter option D"
                  value={optionD}
                  onChange={(e) => {
                    setOptionD(e.target.value);
                    if (correctAnswer === optionD) {
                      setCorrectAnswer("");
                    }
                  }}
                />
              </div>
            </div>

            <label className="cq-label" htmlFor="correct-answer">
              Correct Answer
            </label>

            <select
              id="correct-answer"
              className="cq-input"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            >
              <option value="">Select the correct option</option>
              {[
                ["A", optionA],
                ["B", optionB],
                ["C", optionC],
                ["D", optionD],
              ]
                .filter(([, value]) => value.trim())
                .map(([letter, value]) => (
                  <option key={letter} value={value.trim()}>
                    Option {letter}: {value}
                  </option>
                ))}
            </select>

            <button className="cq-btn cq-add" type="submit">
              + Add Question
            </button>
          </form>

          {questions.length > 0 && (
            <section className="cq-added-section">
              <h2>
                Questions Added <span>{questions.length}</span>
              </h2>

              {questions.map((q, index) => (
                <div className="cq-added-question" key={index}>
                  <strong>Question {index + 1}</strong>
                  <p>{q.question}</p>

                  <button
                    type="button"
                    className="cq-btn"
                    onClick={() =>
                      setQuestions((previous) =>
                        previous.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Remove Question
                  </button>
                </div>
              ))}
            </section>
          )}

          <button
            type="button"
            className="cq-btn cq-finish"
            onClick={createQuiz}
          >
            Save Quiz &amp; Finish 🎯
          </button>
        </section>
      </main>

      <footer className="cq-footer">
        © 2026 Quiz Platform 🎯
      </footer>
    </div>
  );
}

export default CreateQuiz;