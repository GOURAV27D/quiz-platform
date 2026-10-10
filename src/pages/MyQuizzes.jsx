import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes } from "../redux/quizActions.js";

function MyQuizzes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quizzes = useSelector((state) => state.quizzes);

  const deleteQuiz = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmDelete) return;

    const updatedQuizzes = quizzes.filter(
      (_, quizIndex) => quizIndex !== index
    );

    try {
      localStorage.setItem(
        "quizzes",
        JSON.stringify(updatedQuizzes)
      );

      dispatch(setQuizzes(updatedQuizzes));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Could not delete the quiz. Please try again.");
    }
  };

  return (
    <div className="my-quizzes-page">
      <header className="my-quizzes-header">
        <div>
          <span className="my-quizzes-eyebrow">
            YOUR COLLECTION
          </span>

          <h1>My Quizzes 📚</h1>

          <p>Manage your quizzes and keep learning.</p>
        </div>

        <div className="my-quizzes-header-actions">
          <button
            className="mq-btn mq-back"
            onClick={() => navigate("/home")}
          >
            ← Dashboard
          </button>

          <button
            className="mq-btn mq-create"
            onClick={() => navigate("/create-quiz")}
          >
            + Create Quiz
          </button>
        </div>
      </header>

      <main className="my-quizzes-content">
        <div className="mq-summary">
          <span>📚</span>

          <div>
            <strong>{quizzes.length}</strong>
            <p>
              {quizzes.length === 1
                ? "Quiz created"
                : "Quizzes created"}
            </p>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <section className="mq-empty">
            <div className="mq-empty-icon">📝</div>

            <h2>No quizzes yet</h2>

            <p>
              Create your first quiz and it will appear here.
            </p>

            <button
              className="mq-btn mq-create"
              onClick={() => navigate("/create-quiz")}
            >
              Create Your First Quiz →
            </button>
          </section>
        ) : (
          <section className="mq-list">
            {quizzes.map((quiz, index) => (
              <article className="mq-card" key={index}>
                <div className="mq-card-top">
                  <div className="mq-quiz-icon">🧠</div>

                  <span className="mq-badge">
                    {Array.isArray(quiz.questions)
                      ? `${quiz.questions.length} Questions`
                      : "Single Question"}
                  </span>
                </div>

                <h2>{quiz.title || "Untitled Quiz"}</h2>

                {Array.isArray(quiz.questions) ? (
                  <div className="mq-question-list">
                    {quiz.questions.map((question, questionIndex) => (
                      <div
                        className="mq-question"
                        key={questionIndex}
                      >
                        <strong>
                          Question {questionIndex + 1}
                        </strong>

                        <p>{question.question}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mq-question">
                    <strong>Question</strong>

                    <p>
                      {quiz.question || "No question added."}
                    </p>
                  </div>
                )}

                <div className="mq-card-actions">
                  <button
                    className="mq-btn mq-play"
                    onClick={() =>
                      navigate("/play-quiz", {
                        state: { quizIndex: index },
                      })
                    }
                  >
                    ▶ Play
                  </button>

                  <button
                    className="mq-btn mq-edit"
                    onClick={() =>
                      navigate("/edit-quiz", {
                        state: { quizIndex: index },
                      })
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="mq-btn mq-delete"
                    onClick={() => deleteQuiz(index)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="mq-footer">
        © 2026 Quiz Platform 🎯
      </footer>
    </div>
  );
}

export default MyQuizzes;