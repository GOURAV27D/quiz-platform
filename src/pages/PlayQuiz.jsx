import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

function PlayQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const quizIndex = location.state?.quizIndex;

  const quizzes = useSelector((state) => state.quizzes);
  const quiz =
    quizIndex !== undefined ? quizzes[quizIndex] : null;

  const questions = quiz
    ? quiz.questions ||
      (quiz.question
        ? [
            {
              question: quiz.question,
              options: quiz.options || ["", "", "", ""],
              correctAnswer: quiz.correctAnswer || "",
            },
          ]
        : [])
    : [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    const newScore =
      score +
      (selectedAnswer === questions[currentQuestion].correctAnswer
        ? 1
        : 0);

    setScore(newScore);
    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    } else {
      setCompleted(true);
    }
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="play-quiz-page">
        <section className="pq-message-card">
          <div className="pq-trophy">📝</div>
          <h1>{quiz ? "No Questions Found" : "No Quiz Selected"}</h1>
          <p>
            {quiz
              ? "This quiz does not contain any questions yet."
              : "Choose a quiz from My Quizzes to get started."}
          </p>
          <button
            className="pq-btn pq-primary"
            onClick={() => navigate("/my-quizzes")}
          >
            ← Back to My Quizzes
          </button>
        </section>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="play-quiz-page">
        <section className="pq-result-card">
          <div className="pq-trophy">
            {percentage >= 80
              ? "🏆"
              : percentage >= 50
              ? "🎉"
              : "💪"}
          </div>

          <span className="pq-eyebrow">QUIZ FINISHED</span>
          <h1>Quiz Completed!</h1>
          <p className="pq-result-title">{quiz.title}</p>

          <div className="pq-score-circle">
            <strong>{percentage}%</strong>
            <span>Your Score</span>
          </div>

          <h2>
            {score} out of {questions.length} correct
          </h2>

          <p className="pq-feedback">
            {percentage >= 80
              ? "Excellent work! Keep it up. 🔥"
              : percentage >= 50
              ? "Good job! A little more practice will help. 👍"
              : "Keep practicing. You'll improve! 💪"}
          </p>

          <div className="pq-result-actions">
            <button
              className="pq-btn pq-primary"
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
        </section>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="play-quiz-page">
      <header className="pq-header">
        <div>
          <span className="pq-eyebrow">TEST YOUR KNOWLEDGE</span>
          <h1>Let's Play! 🎮</h1>
          <p>{quiz.title}</p>
        </div>

        <button
          className="pq-btn pq-header-back"
          onClick={() => navigate("/my-quizzes")}
        >
          ✕ Exit Quiz
        </button>
      </header>

      <main className="pq-main">
        <section className="pq-question-card">
          <div className="pq-question-meta">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <strong>{Math.round(progress)}% complete</strong>
          </div>

          <div className="pq-progress-track">
            <div
              className="pq-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h2 className="pq-question-text">{question.question}</h2>
          <p className="pq-instruction">
            Choose one answer below.
          </p>

          <div className="pq-options">
            {question.options.map((option, index) => (
              <label
                className={`pq-option ${
                  selectedAnswer === option
                    ? "pq-option-selected"
                    : ""
                }`}
                key={index}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) =>
                    setSelectedAnswer(e.target.value)
                  }
                />

                <span className="pq-option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="pq-option-text">{option}</span>
              </label>
            ))}
          </div>

          <button
            className="pq-btn pq-primary pq-next"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            {currentQuestion === questions.length - 1
              ? "Finish Quiz ✓"
              : "Next Question →"}
          </button>

          <p className="pq-reminder">
            Take your time and choose carefully.
          </p>
        </section>
      </main>

      <footer className="pq-footer">
        © 2026 Quiz Platform 🎯
      </footer>
    </div>
  );
}

export default PlayQuiz;