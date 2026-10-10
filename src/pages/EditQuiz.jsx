import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes } from "../redux/quizActions.js";

function EditQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quizIndex = location.state?.quizIndex;
  const quizzes = useSelector((state) => state.quizzes);
  const quiz =
    quizIndex !== undefined ? quizzes[quizIndex] : null;

  const [title, setTitle] = useState(quiz?.title || "");

  const [questions, setQuestions] = useState(() => {
    if (quiz?.questions) return quiz.questions;

    if (quiz) {
      return [
        {
          question: quiz.question || "",
          options: quiz.options || ["", "", "", ""],
          correctAnswer: quiz.correctAnswer || "",
        },
      ];
    }

    return [];
  });

  if (!quiz) {
    return (
      <div className="edit-quiz-page">
        <section className="eq-not-found">
          <div className="eq-icon">🔎</div>
          <h2>Quiz not found</h2>
          <p>Please return to your quiz collection and try again.</p>
          <button
            className="eq-btn eq-save"
            onClick={() => navigate("/my-quizzes")}
          >
            ← Back to My Quizzes
          </button>
        </section>
      </div>
    );
  }

  const handleQuestionChange = (questionIndex, value) => {
    setQuestions((previous) =>
      previous.map((q, i) =>
        i === questionIndex ? { ...q, question: value } : q
      )
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((previous) =>
      previous.map((q, i) => {
        if (i !== questionIndex) return q;

        const oldValue = q.options[optionIndex];
        const options = [...q.options];
        options[optionIndex] = value;

        return {
          ...q,
          options,
          correctAnswer:
            q.correctAnswer === oldValue ? value : q.correctAnswer,
        };
      })
    );
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    setQuestions((previous) =>
      previous.map((q, i) =>
        i === questionIndex ? { ...q, correctAnswer: value } : q
      )
    );
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter quiz title.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    for (const question of questions) {
      if (
        !question.question.trim() ||
        question.options.length !== 4 ||
        question.options.some((option) => !option.trim()) ||
        !question.correctAnswer ||
        !question.options.includes(question.correctAnswer)
      ) {
        alert("Please complete every question, option, and correct answer.");
        return;
      }
    }

    const updatedQuestions = questions.map((q) => ({
      ...q,
      question: q.question.trim(),
      options: q.options.map((option) => option.trim()),
      correctAnswer: q.correctAnswer.trim(),
    }));

    const updatedQuizzes = quizzes.map((item, index) =>
      index === quizIndex
        ? {
            ...item,
            title: title.trim(),
            questions: updatedQuestions,
          }
        : item
    );

    try {
      localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
      dispatch(setQuizzes(updatedQuizzes));

      alert("Quiz updated successfully! ✅");
      navigate("/my-quizzes");
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Could not save your changes. Please try again.");
    }
  };

  return (
    <div className="edit-quiz-page">
      <header className="eq-header">
        <div>
          <span className="eq-eyebrow">UPDATE YOUR COLLECTION</span>
          <h1>Edit Quiz ✏️</h1>
          <p>Make changes to your quiz and save them when you're ready.</p>
        </div>

        <button
          className="eq-btn eq-back"
          onClick={() => navigate("/my-quizzes")}
        >
          ← My Quizzes
        </button>
      </header>

      <main className="eq-main">
        <form className="eq-form-card" onSubmit={handleSave}>
          <div className="eq-section-title">
            <span className="eq-icon">📋</span>
            <div>
              <h2>Quiz Details</h2>
              <p>Update the title and questions below.</p>
            </div>
          </div>

          <label className="eq-label" htmlFor="edit-title">
            Quiz Title
          </label>
          <input
            id="edit-title"
            className="eq-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {questions.map((question, questionIndex) => (
            <section className="eq-question-card" key={questionIndex}>
              <h3>Question {questionIndex + 1}</h3>

              <label
                className="eq-label"
                htmlFor={`edit-q-${questionIndex}`}
              >
                Question
              </label>
              <textarea
                id={`edit-q-${questionIndex}`}
                className="eq-input eq-textarea"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(questionIndex, e.target.value)
                }
                required
              />

              <div className="eq-options-grid">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <label
                      className="eq-label"
                      htmlFor={`edit-${questionIndex}-${optionIndex}`}
                    >
                      Option {String.fromCharCode(65 + optionIndex)}
                    </label>
                    <input
                      id={`edit-${questionIndex}-${optionIndex}`}
                      className="eq-input"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(
                          questionIndex,
                          optionIndex,
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                ))}
              </div>

              <label
                className="eq-label"
                htmlFor={`correct-${questionIndex}`}
              >
                Correct Answer
              </label>
              <select
                id={`correct-${questionIndex}`}
                className="eq-input"
                value={question.correctAnswer}
                onChange={(e) =>
                  handleCorrectAnswerChange(questionIndex, e.target.value)
                }
                required
              >
                <option value="">Select correct answer</option>
                {question.options.map((option, optionIndex) => (
                  <option
                    key={optionIndex}
                    value={option}
                    disabled={!option.trim()}
                  >
                    Option {String.fromCharCode(65 + optionIndex)}
                    {option.trim() ? `: ${option}` : ""}
                  </option>
                ))}
              </select>
            </section>
          ))}

          <button className="eq-btn eq-save" type="submit">
            💾 Save Changes
          </button>

          <button
            className="eq-btn eq-cancel"
            type="button"
            onClick={() => navigate("/my-quizzes")}
          >
            Cancel
          </button>
        </form>
      </main>

      <footer className="eq-footer">© 2026 Quiz Platform 🎯</footer>
    </div>
  );
}

export default EditQuiz;