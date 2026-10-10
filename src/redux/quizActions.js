export const setQuizzes = (quizzes) => ({
  type: "SET_QUIZZES",
  payload: quizzes,
});

export const saveQuiz = (quiz) => {
  return (dispatch) => {
    try {
      const savedQuizzes = JSON.parse(
        localStorage.getItem("quizzes") || "[]"
      );

      if (!Array.isArray(savedQuizzes)) {
        throw new Error("Saved quizzes must be an array.");
      }

      const updatedQuizzes = [...savedQuizzes, quiz];

      localStorage.setItem(
        "quizzes",
        JSON.stringify(updatedQuizzes)
      );

      dispatch(setQuizzes(updatedQuizzes));

      return { success: true };
    } catch (error) {
      console.error("Error saving quiz:", error);
      return { success: false };
    }
  };
};