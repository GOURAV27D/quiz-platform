import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveQuiz } from "../redux/quizActions.js";

const createEmptyQuestion = () => ({
  type: "single",
  question: "",
  options: ["", ""],
  correctAnswer: "",
  correctAnswers: [],
  expectedAnswer: "",
  expectedSentences: 2,
});

function CreateQuiz() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(createEmptyQuestion());

  const isMCQ =
    current.type === "single" || current.type === "multiple";

  const updateQuestion = (field, value) => {
    setCurrent((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const changeType = (type) => {
    setCurrent({
      ...createEmptyQuestion(),
      type,
    });
  };

  const updateOption = (index, value) => {
    setCurrent((previous) => {
      const options = [...previous.options];
      const oldValue = options[index];
      options[index] = value;

      return {
        ...previous,
        options,
        correctAnswer:
          previous.correctAnswer === oldValue
            ? ""
            : previous.correctAnswer,
        correctAnswers: previous.correctAnswers.filter(
          (answer) => answer !== oldValue
        ),
      };
    });
  };

  const addOption = () => {
    if (current.options.length >= 4) {
      alert("You can add a maximum of four options.");
      return;
    }

    updateQuestion("options", [...current.options, ""]);
  };

  const removeOption = (index) => {
    if (current.options.length <= 2) {
      alert("At least two options are required.");
      return;
    }

    const removed = current.options[index];

    setCurrent((previous) => ({
      ...previous,
      options: previous.options.filter((_, i) => i !== index),
      correctAnswer:
        previous.correctAnswer === removed
          ? ""
          : previous.correctAnswer,
      correctAnswers: previous.correctAnswers.filter(
        (answer) => answer !== removed
      ),
    }));
  };

  const toggleCorrectAnswer = (option) => {
    setCurrent((previous) => {
      const selected = previous.correctAnswers;

      return {
        ...previous,
        correctAnswers: selected.includes(option)
          ? selected.filter((answer) => answer !== option)
          : [...selected, option],
      };
    });
  };

  const addQuestion = (event) => {
    event.preventDefault();

    const questionText = current.question.trim();

    if (questionText.length < 10 || questionText.length > 200) {
      alert("Question must be between 10 and 200 characters.");
      return;
    }

    let newQuestion;

    if (isMCQ) {
      const options = current.options.map((option) => option.trim());

      if (options.some((option) => !option)) {
        alert("Please fill in every option.");
        return;
      }

      if (new Set(options.map((option) => option.toLowerCase())).size !== options.length) {
        alert("All options must be different.");
        return;
      }

      if (current.type === "single") {
        if (!current.correctAnswer || !options.includes(current.correctAnswer.trim())) {
          alert("Please select the correct answer.");
          return;
        }

        newQuestion = {
          type: "single",
          question: questionText,
          options,
          correctAnswer: current.correctAnswer.trim(),
        };
      } else {
        const correctAnswers = current.correctAnswers.filter(
          (answer) => options.includes(answer.trim())
        );

        if (correctAnswers.length === 0) {
          alert("Select at least one correct answer.");
          return;
        }

        newQuestion = {
          type: "multiple",
          question: questionText,
          options,
          correctAnswers,
        };
      }
    } else if (current.type === "short") {
      const expectedAnswer = current.expectedAnswer.trim();
      const wordCount = expectedAnswer
        ? expectedAnswer.split(/\s+/).length
        : 0;

      if (!expectedAnswer || wordCount > 2) {
        alert("Enter an expected answer using one or two words.");
        return;
      }

      newQuestion = {
        type: "short",
        question: questionText,
        expectedAnswer,
      };
    } else {
      newQuestion = {
        type: "description",
        question: questionText,
        expectedSentences: Number(current.expectedSentences),
      };
    }

    setQuestions((previous) => [...previous, newQuestion]);
    setCurrent(createEmptyQuestion());
    alert("Question added successfully!");
  };

  const removeQuestion = (index) => {
    setQuestions((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const createQuiz = () => {
    const cleanTitle = title.trim();

    if (cleanTitle.length < 10 || cleanTitle.length > 30) {
      alert("Quiz title must be between 10 and 30 characters.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    const result = dispatch(
      saveQuiz({
        id: Date.now().toString(),
        title: cleanTitle,
        questions,
      })
    );

    if (result?.success) {
      alert("Quiz created successfully!");
      navigate("/my-quizzes");
    } else {
      alert("Could not save the quiz. Please try again.");
    }
  };

  return (
    <div className="create-quiz-page">
      <header className="create-quiz-header">
        <div>
          <span className="cq-eyebrow">BUILD SOMETHING GREAT</span>
          <h1>Create a Quiz 📝</h1>
          <p>Create different question types for your quiz.</p>
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
              <p>Give your quiz a title between 10 and 30 characters.</p>
            </div>
          </div>

          <label className="cq-label" htmlFor="quiz-title">
            Quiz Title
          </label>
          <input
            id="quiz-title"
            className="cq-input"
            value={title}
            minLength={10}
            maxLength={30}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. General Knowledge"
          />

          <div className="cq-divider" />

          <div className="cq-section-title">
            <span className="cq-section-icon">💡</span>
            <div>
              <h2>Add a Question</h2>
              <p>Choose the type and fill in the details.</p>
            </div>
          </div>

          <form onSubmit={addQuestion}>
            <label className="cq-label" htmlFor="question-type">
              Question Type
            </label>
            <select
              id="question-type"
              className="cq-input"
              value={current.type}
              onChange={(event) => changeType(event.target.value)}
            >
              <option value="single">MCQ — Single Correct Answer</option>
              <option value="multiple">MCQ — Multiple Correct Answers</option>
              <option value="short">Short Answer — Up to 2 Words</option>
              <option value="description">Description — 2 or 4 Sentences</option>
            </select>

            <label className="cq-label" htmlFor="question">
              Question ({current.question.length}/200 characters)
            </label>
            <textarea
              id="question"
              className="cq-input cq-textarea"
              value={current.question}
              minLength={10}
              maxLength={200}
              onChange={(event) =>
                updateQuestion("question", event.target.value)
              }
              placeholder="Type your question here..."
            />

            {isMCQ && (
              <>
                <div className="cq-options-grid">
                  {current.options.map((option, index) => (
                    <div key={index}>
                      <label className="cq-label" htmlFor={`option-${index}`}>
                        Option {String.fromCharCode(65 + index)}
                      </label>

                      <div>
                        <input
                          id={`option-${index}`}
                          className="cq-input"
                          value={option}
                          maxLength={100}
                          onChange={(event) =>
                            updateOption(index, event.target.value)
                          }
                          placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                        />

                        {current.options.length > 2 && (
                          <button
                            type="button"
                            className="cq-btn"
                            onClick={() => removeOption(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {current.options.length < 4 && (
                  <button
                    type="button"
                    className="cq-btn"
                    onClick={addOption}
                  >
                    + Add Option
                  </button>
                )}

                <label className="cq-label">
                  {current.type === "single"
                    ? "Select the correct answer"
                    : "Select all correct answers"}
                </label>

                {current.options.map((option, index) =>
                  option.trim() ? (
                    <label
                      key={index}
                      style={{ display: "block", margin: "10px 0" }}
                    >
                      <input
                        type={current.type === "single" ? "radio" : "checkbox"}
                        name="correct-answer"
                        checked={
                          current.type === "single"
                            ? current.correctAnswer === option.trim()
                            : current.correctAnswers.includes(option.trim())
                        }
                        onChange={() => {
                          if (current.type === "single") {
                            updateQuestion("correctAnswer", option.trim());
                          } else {
                            toggleCorrectAnswer(option.trim());
                          }
                        }}
                      />
                      {" "}
                      {String.fromCharCode(65 + index)}. {option}
                    </label>
                  ) : null
                )}
              </>
            )}

            {current.type === "short" && (
              <>
                <label className="cq-label" htmlFor="expected-answer">
                  Expected Answer (maximum 2 words)
                </label>
                <input
                  id="expected-answer"
                  className="cq-input"
                  value={current.expectedAnswer}
                  maxLength={100}
                  onChange={(event) =>
                    updateQuestion("expectedAnswer", event.target.value)
                  }
                  placeholder="e.g. New Delhi"
                />
              </>
            )}

            {current.type === "description" && (
              <>
                <label className="cq-label" htmlFor="expected-sentences">
                  Expected Response Length
                </label>
                <select
                  id="expected-sentences"
                  className="cq-input"
                  value={current.expectedSentences}
                  onChange={(event) =>
                    updateQuestion("expectedSentences", event.target.value)
                  }
                >
                  <option value={2}>2 sentences</option>
                  <option value={4}>4 sentences</option>
                </select>
                <p>
                  Descriptive answers will need manual review; they cannot be
                  reliably marked correct automatically.
                </p>
              </>
            )}

            <button className="cq-btn cq-add" type="submit">
              + Add Question
            </button>
          </form>

          {questions.length > 0 && (
            <section className="cq-added-section">
              <h2>
                Questions Added <span>{questions.length}</span>
              </h2>

              {questions.map((question, index) => (
                <div className="cq-added-question" key={index}>
                  <strong>
                    Question {index + 1} — {question.type}
                  </strong>
                  <p>{question.question}</p>
                  <button
                    type="button"
                    className="cq-btn"
                    onClick={() => removeQuestion(index)}
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

      <footer className="cq-footer">© 2026 Quiz Platform 🎯</footer>
    </div>
  );
}

export default CreateQuiz;