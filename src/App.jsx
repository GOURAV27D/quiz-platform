import { BrowserRouter, Routes, Route } from "react-router-dom";

import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import MyQuizzes from "./pages/MyQuizzes";
import PlayQuiz from "./pages/PlayQuiz";
import EditQuiz from "./pages/EditQuiz";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication />} />

        <Route path="/home" element={<Home />} />
        <Route path="/my-quizzes" element={<MyQuizzes />} />
        <Route path="/play-quiz" element={<PlayQuiz />} />
        <Route path="/edit-quiz" element={<EditQuiz />} />

        <Route path="/create-quiz" element={<CreateQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;