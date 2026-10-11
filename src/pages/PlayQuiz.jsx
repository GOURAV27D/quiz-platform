import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PlayQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const quizIndex = location.state?.quizIndex;
  const quizzes = useSelector((state) => state.quizzes);
  const quiz = quizzes[quizIndex];

  const questions = quiz
    ? quiz.questions ||
      [
        {
          type: "single",
          question: quiz.question,
          options: quiz.options || ["", "", "", ""],
          correctAnswer: quiz.correctAnswer,
        },
      ]
    : [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState([]);
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);

  if (!quiz || questions.length === 0) {
    return (
      <div className="play-quiz-page">
        <main className="pq-card">
          <div className="pq-result-icon">🔎</div>
          <h1>Quiz not found</h1>
          <p>Please select a quiz from My Quizzes.</p>
          <button
            className="pq-btn"
            onClick={() => navigate("/my-quizzes")}
          >
            Back to My Quizzes
          </button>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const type = question.type || "single";
  const isMultiple = type === "multiple";
  const isDescription = type === "description";
  const isShort = type === "short";
  const isMCQ = type === "single" || isMultiple;

  const responseText = Array.isArray(answer) ? "" : answer;

  const hasAnswer = isMCQ
    ? answer.length > 0
    : typeof answer === "string" && answer.trim().length > 0;

  const checkAnswer = () => {
    if (type === "single") {
      return (
        String(answer).trim().toLowerCase() ===
        String(question.correctAnswer || "").trim().toLowerCase()
      );
    }

    if (isMultiple) {
      const expected = (question.correctAnswers || [])
        .map((item) => String(item).trim().toLowerCase())
        .sort();

      const selected = [...answer]
        .map((item) => String(item).trim().toLowerCase())
        .sort();

      return (
        expected.length > 0 &&
        expected.length === selected.length &&
        expected.every((item, index) => item === selected[index])
      );
    }

    if (isShort) {
      return (
        String(answer).trim().toLowerCase() ===
        String(question.expectedAnswer || "").trim().toLowerCase()
      );
    }

    return null;
  };

  const handleNext = () => {
    if (!hasAnswer) return;

    const correct = checkAnswer();

    const result = {
      question: question.question,
      type,
      answer,
      correct,
      expectedAnswer:
        type === "single"
          ? question.correctAnswer
          : isMultiple
            ? question.correctAnswers
            : isShort
              ? question.expectedAnswer
              : null,
    };

    const updatedResults = [...results, result];
    setResults(updatedResults);
    setAnswer([]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    } else {
      setCompleted(true);
    }
  };

  const progress = ((currentQuestion + (completed ? 1 : 0)) /
    questions.length) * 100;

  if (completed) {
    const automaticallyGraded = results.filter(
      (result) => result.correct !== null
    );
    const score = automaticallyGraded.filter(
      (result) => result.correct
    ).length;

    return (
      <div className="play-quiz-page">
        <header className="pq-header">
          <div>
            <span className="pq-eyebrow">QUIZ COMPLETED</span>
            <h1>{quiz.title}</h1>
            <p>You've reached the end of your quiz.</p>
          </div>
        </header>

        <main className="pq-card">
          <div className="pq-result-icon">🎉</div>
          <h1>Well Done!</h1>
          <p className="pq-result-subtitle">Here is your result summary.</p>

          <div className="pq-score-panel">
            <span>Automatically graded score</span>
            <strong>
              {score} / {automaticallyGraded.length}
            </strong>
            <span>
              {automaticallyGraded.length
                ? `${Math.round(
                    (score / automaticallyGraded.length) * 100
                  )}%`
                : "No automatically graded questions"}
            </span>
          </div>

          <p>
            Descriptive answers awaiting manual review:{" "}
            {results.filter((result) => result.type === "description").length}
          </p>

          <div className="pq-review-list">
            <h2>Answer Summary</h2>
            {results.map((result, index) => (
              <article className="pq-review-item" key={index}>
                <h3>
                  {index + 1}. {result.question}
                </h3>
                <p>
                  <strong>Your answer:</strong>{" "}
                  {Array.isArray(result.answer)
                    ? result.answer.join(", ")
                    : result.answer}
                </p>

                {result.correct === null ? (
                  <p className="pq-review-pending">
                    Submitted for manual review
                  </p>
                ) : (
                  <p
                    className={
                      result.correct
                        ? "pq-review-correct"
                        : "pq-review-wrong"
                    }
                  >
                    {result.correct ? "✓ Correct answer" : "✕ Incorrect answer"}
                  </p>
                )}

                {result.correct === false && result.expectedAnswer && (
                  <p>
                    <strong>Expected answer:</strong>{" "}
                    {Array.isArray(result.expectedAnswer)
                      ? result.expectedAnswer.join(", ")
                      : result.expectedAnswer}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="pq-actions">
            <button
              className="pq-btn"
              onClick={() => navigate("/my-quizzes")}
            >
              My Quizzes
            </button>
            <button
              className="pq-btn pq-secondary"
              onClick={() => navigate("/home")}
            >
              Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="play-quiz-page">
      <header className="pq-header">
        <div>
          <span className="pq-eyebrow">QUIZ IN PROGRESS</span>
          <h1>{quiz.title}</h1>
          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <button
          type="button"
          className="pq-btn pq-secondary"
          onClick={() => navigate("/my-quizzes")}
        >
          ✕ Exit Quiz
        </button>
      </header>

      <main className="pq-card">
        <div className="pq-progress-info">
          <span>YOUR PROGRESS</span>
          <strong>{Math.round(progress)}%</strong>
        </div>

        <div
          className="pq-progress-track"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="pq-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="pq-question-heading">
          <span className="pq-question-number">
            QUESTION {currentQuestion + 1}
          </span>
          <span className="pq-type-label">
            {type === "single"
              ? "Single choice"
              : type === "multiple"
                ? "Multiple choice"
                : type === "short"
                  ? "Short answer"
                  : "Descriptive"}
          </span>
        </div>

        <h2 className="pq-question-title">{question.question}</h2>

        {isMCQ && (
          <div className="pq-options">
            {(question.options || []).map((option, index) => {
              const selected = isMultiple
                ? answer.includes(option)
                : answer === option;

              return (
                <label
                  key={index}
                  className={`pq-option ${selected ? "pq-option-selected" : ""}`}
                >
                  <input
                    type={isMultiple ? "checkbox" : "radio"}
                    name={`question-${currentQuestion}`}
                    checked={selected}
                    onChange={() => {
                      if (isMultiple) {
                        setAnswer((previous) =>
                          previous.includes(option)
                            ? previous.filter((item) => item !== option)
                            : [...previous, option]
                        );
                      } else {
                        setAnswer(option);
                      }
                    }}
                  />
                  <span className="pq-option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="pq-option-text">{option}</span>
                  <span className="pq-option-check">
                    {selected ? "✓" : ""}
                  </span>
                </label>
              );
            })}

            {isMultiple && (
              <p className="pq-helper-text">
                Select all answers you think are correct.
              </p>
            )}
          </div>
        )}

        {isShort && (
          <div className="pq-answer-area">
            <label htmlFor="short-answer">Your answer (up to 2 words)</label>
            <input
              id="short-answer"
              className="pq-input"
              value={responseText}
              maxLength={100}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type your answer here..."
            />
          </div>
        )}

        {isDescription && (
          <div className="pq-answer-area">
            <label htmlFor="description-answer">
              Your answer ({question.expectedSentences || 2} sentences)
            </label>
            <textarea
              id="description-answer"
              className="pq-input pq-textarea"
              value={responseText}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Write your answer here..."
              rows={5}
            />
            <p className="pq-helper-text">
              Your descriptive answer will be submitted for manual review.
            </p>
          </div>
        )}

        <footer className="pq-footer-actions">
          <span>
            {currentQuestion + 1} of {questions.length} questions
          </span>
          <button
            type="button"
            className="pq-btn"
            onClick={handleNext}
            disabled={!hasAnswer}
          >
            {currentQuestion === questions.length - 1
              ? "Finish Quiz ✓"
              : "Next Question →"}
          </button>
        </footer>
      </main>
    </div>
  );
}

export default PlayQuiz;