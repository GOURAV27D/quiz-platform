import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

const initialState = {
  quizzes: JSON.parse(localStorage.getItem("quizzes") || "[]"),
};

function quizReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_QUIZZES":
      return {
        ...state,
        quizzes: action.payload,
      };

    default:
      return state;
  }
}

const store = createStore(
  quizReducer,
  applyMiddleware(thunk)
);

export default store;