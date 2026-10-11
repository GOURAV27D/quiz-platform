import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes } from "../redux/quizActions.js";

function normalizeQuestion(q) {
  return {
    ...q,
    type: q.type || "single",
    options: q.options || ["", ""],
    correctAnswers: q.correctAnswers || [],
    expectedAnswer: q.expectedAnswer || "",
    expectedSentences: q.expectedSentences || 2,
  };
}

function EditQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quizIndex = location.state?.quizIndex;
  const quizzes = useSelector((state) => state.quizzes);
  const quiz = quizIndex !== undefined ? quizzes[quizIndex] : null;

  const [title, setTitle] = useState(quiz?.title || "");

  const [questions, setQuestions] = useState(() => {
    if (quiz?.questions) {
      return quiz.questions.map(normalizeQuestion);
    }

    if (quiz) {
      return [
        normalizeQuestion({
          question: quiz.question || "",
          options: quiz.options || ["", ""],
          correctAnswer: quiz.correctAnswer || "",
        }),
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
            type="button"
            className="eq-btn eq-save"
            onClick={() => navigate("/my-quizzes")}
          >
            ← Back to My Quizzes
          </button>
        </section>
      </div>
    );
  }

  const updateQuestion = (questionIndex, changes) => {
    setQuestions((previous) =>
      previous.map((q, i) =>
        i === questionIndex ? { ...q, ...changes } : q
      )
    );
  };

  const handleTypeChange = (questionIndex, type) => {
    updateQuestion(questionIndex, {
      type,
      options: ["", ""],
      correctAnswer: "",
      correctAnswers: [],
      expectedAnswer: "",
      expectedSentences: 2,
    });
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
            q.correctAnswer === oldValue ? "" : q.correctAnswer,
          correctAnswers: q.correctAnswers.filter(
            (answer) => answer !== oldValue
          ),
        };
      })
    );
  };

  const handleAddOption = (questionIndex) => {
    const question = questions[questionIndex];

    if (question.options.length >= 4) {
      alert("A maximum of four options is allowed.");
      return;
    }

    updateQuestion(questionIndex, {
      options: [...question.options, ""],
    });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const question = questions[questionIndex];

    if (question.options.length <= 2) {
      alert("At least two options are required.");
      return;
    }

    const removed = question.options[optionIndex];

    updateQuestion(questionIndex, {
      options: question.options.filter((_, i) => i !== optionIndex),
      correctAnswer:
        question.correctAnswer === removed
          ? ""
          : question.correctAnswer,
      correctAnswers: question.correctAnswers.filter(
        (answer) => answer !== removed
      ),
    });
  };

  const handleAddQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      normalizeQuestion({
        type: "single",
        question: "",
        options: ["", ""],
        correctAnswer: "",
      }),
    ]);
  };

  const handleRemoveQuestion = (questionIndex) => {
    if (!window.confirm("Are you sure you want to remove this question?")) {
      return;
    }

    setQuestions((previous) =>
      previous.filter((_, i) => i !== questionIndex)
    );
  };

  const handleSave = (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (cleanTitle.length < 10 || cleanTitle.length > 30) {
      alert("Quiz title must be between 10 and 30 characters.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    const updatedQuestions = [];

    for (let index = 0; index < questions.length; index++) {
      const q = questions[index];
      const questionText = q.question.trim();

      if (questionText.length < 10 || questionText.length > 200) {
        alert(`Question ${index + 1} must be between 10 and 200 characters.`);
        return;
      }

      if (q.type === "single" || q.type === "multiple") {
        const options = q.options.map((option) => option.trim());

        if (
          options.length < 2 ||
          options.length > 4 ||
          options.some((option) => !option)
        ) {
          alert(`Question ${index + 1} needs 2–4 completed options.`);
          return;
        }

        if (
          new Set(options.map((option) => option.toLowerCase())).size !==
          options.length
        ) {
          alert(`Question ${index + 1} has duplicate options.`);
          return;
        }

        if (q.type === "single") {
          const correctAnswer = (q.correctAnswer || "").trim();

          if (!options.includes(correctAnswer)) {
            alert(`Select a correct answer for question ${index + 1}.`);
            return;
          }

          updatedQuestions.push({
            type: "single",
            question: questionText,
            options,
            correctAnswer,
          });
        } else {
          const correctAnswers = q.correctAnswers.filter((answer) =>
            options.includes(answer.trim())
          );

          if (correctAnswers.length === 0) {
            alert(
              `Select at least one correct answer for question ${index + 1}.`
            );
            return;
          }

          updatedQuestions.push({
            type: "multiple",
            question: questionText,
            options,
            correctAnswers,
          });
        }
      } else if (q.type === "short") {
        const expectedAnswer = q.expectedAnswer.trim();
        const wordCount = expectedAnswer
          ? expectedAnswer.split(/\s+/).length
          : 0;

        if (!expectedAnswer || wordCount > 2) {
          alert(
            `Question ${index + 1} needs an expected answer of one or two words.`
          );
          return;
        }

        updatedQuestions.push({
          type: "short",
          question: questionText,
          expectedAnswer,
        });
      } else if (q.type === "description") {
        if (![2, 4].includes(Number(q.expectedSentences))) {
          alert(`Choose 2 or 4 expected sentences for question ${index + 1}.`);
          return;
        }

        updatedQuestions.push({
          type: "description",
          question: questionText,
          expectedSentences: Number(q.expectedSentences),
        });
      }
    }

    const updatedQuizzes = quizzes.map((item, index) =>
      index === quizIndex
        ? {
            ...item,
            title: cleanTitle,
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
          type="button"
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
            Quiz Title (10–30 characters)
          </label>
          <input
            id="edit-title"
            className="eq-input"
            value={title}
            minLength={10}
            maxLength={30}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          {questions.map((question, questionIndex) => (
            <section className="eq-question-card" key={questionIndex}>
              <h3>Question {questionIndex + 1}</h3>

              <label
                className="eq-label"
                htmlFor={`edit-type-${questionIndex}`}
              >
                Question Type
              </label>
              <select
                id={`edit-type-${questionIndex}`}
                className="eq-input"
                value={question.type}
                onChange={(event) =>
                  handleTypeChange(questionIndex, event.target.value)
                }
              >
                <option value="single">MCQ — Single Correct Answer</option>
                <option value="multiple">MCQ — Multiple Correct Answers</option>
                <option value="short">Short Answer — Up to 2 Words</option>
                <option value="description">Description — 2 or 4 Sentences</option>
              </select>

              <label
                className="eq-label"
                htmlFor={`edit-q-${questionIndex}`}
              >
                Question (10–200 characters)
              </label>
              <textarea
                id={`edit-q-${questionIndex}`}
                className="eq-input eq-textarea"
                value={question.question}
                minLength={10}
                maxLength={200}
                onChange={(event) =>
                  updateQuestion(questionIndex, {
                    question: event.target.value,
                  })
                }
                required
              />

              {(question.type === "single" ||
                question.type === "multiple") && (
                <>
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
                          maxLength={100}
                          onChange={(event) =>
                            handleOptionChange(
                              questionIndex,
                              optionIndex,
                              event.target.value
                            )
                          }
                          required
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            className="eq-btn eq-cancel"
                            onClick={() =>
                              handleRemoveOption(questionIndex, optionIndex)
                            }
                          >
                            Remove Option
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {question.options.length < 4 && (
                    <button
                      type="button"
                      className="eq-btn"
                      onClick={() => handleAddOption(questionIndex)}
                    >
                      + Add Option
                    </button>
                  )}

                  <p className="eq-label">
                    {question.type === "single"
                      ? "Select the correct answer"
                      : "Select all correct answers"}
                  </p>

                  {question.options.map((option, optionIndex) =>
                    option.trim() ? (
                      <label
                        key={optionIndex}
                        style={{ display: "block", margin: "10px 0" }}
                      >
                        <input
                          type={
                            question.type === "single" ? "radio" : "checkbox"
                          }
                          name={`correct-${questionIndex}`}
                          checked={
                            question.type === "single"
                              ? question.correctAnswer === option.trim()
                              : question.correctAnswers.includes(option.trim())
                          }
                          onChange={() => {
                            if (question.type === "single") {
                              updateQuestion(questionIndex, {
                                correctAnswer: option.trim(),
                              });
                            } else {
                              const answer = option.trim();
                              const selected = question.correctAnswers;
                              updateQuestion(questionIndex, {
                                correctAnswers: selected.includes(answer)
                                  ? selected.filter((item) => item !== answer)
                                  : [...selected, answer],
                              });
                            }
                          }}
                        />
                        {" "}
                        Option {String.fromCharCode(65 + optionIndex)}: {option}
                      </label>
                    ) : null
                  )}
                </>
              )}

              {question.type === "short" && (
                <>
                  <label
                    className="eq-label"
                    htmlFor={`expected-${questionIndex}`}
                  >
                    Expected Answer (maximum 2 words)
                  </label>
                  <input
                    id={`expected-${questionIndex}`}
                    className="eq-input"
                    value={question.expectedAnswer}
                    maxLength={100}
                    onChange={(event) =>
                      updateQuestion(questionIndex, {
                        expectedAnswer: event.target.value,
                      })
                    }
                    required
                  />
                </>
              )}

              {question.type === "description" && (
                <>
                  <label
                    className="eq-label"
                    htmlFor={`sentences-${questionIndex}`}
                  >
                    Expected Response Length
                  </label>
                  <select
                    id={`sentences-${questionIndex}`}
                    className="eq-input"
                    value={question.expectedSentences}
                    onChange={(event) =>
                      updateQuestion(questionIndex, {
                        expectedSentences: Number(event.target.value),
                      })
                    }
                  >
                    <option value={2}>2 sentences</option>
                    <option value={4}>4 sentences</option>
                  </select>
                  <p>
                    Descriptive answers will be submitted for manual review.
                  </p>
                </>
              )}

              <button
                type="button"
                className="eq-btn eq-cancel"
                onClick={() => handleRemoveQuestion(questionIndex)}
              >
                Remove Question
              </button>
            </section>
          ))}

          <button
            type="button"
            className="eq-btn"
            onClick={handleAddQuestion}
          >
            + Add Question
          </button>

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