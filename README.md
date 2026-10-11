Quiz Platform

A responsive quiz platform built using React that allows users to create, manage, and play quizzes. It provides a simple interface for creating multiple-choice questions, editing quizzes, checking answers, and viewing scores.

Live Demo

https://quiz-platform-iota-five.vercel.app

GitHub Repository

https://github.com/GOURAV27D/quiz-platform

Features

- Create new quizzes with questions and multiple-choice options.
- View saved quizzes.
- Edit existing quizzes.
- Delete quizzes.
- Play quizzes and select answers.
- Calculate and display quiz scores.
- Store quiz data in browser localStorage.
- Use a simple and responsive user interface.

Technologies Used

- React.js
- JavaScript
- HTML5
- CSS3
- React Router DOM
- Redux
- Redux Thunk
- Material UI
- localStorage
- Vercel for deployment
- Git and GitHub for version control

Project Structure

Quiz Platform/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Authentication.jsx
│   │   ├── CreateQuiz.jsx
│   │   ├── EditQuiz.jsx
│   │   ├── Home.jsx
│   │   ├── MyQuizzes.jsx
│   │   ├── PlayQuiz.jsx
│   │   └── ResultQuiz.jsx
│   ├── redux/
│   │   ├── quizActions.js
│   │   └── store.js
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md

Installation and Setup

1. Clone the repository:
   
   git clone https://github.com/GOURAV27D/quiz-platform.git

2. Open the project folder:
   
   cd quiz-platform

3. Install dependencies:
   
   npm install

4. Start the development server:
   
   npm run dev

5. Open the local URL displayed in the terminal.

How to Use

1. Open the Quiz Platform website.
2. Navigate through the available quiz options.
3. Create a quiz and add questions with answer options.
4. View, edit, or delete saved quizzes.
5. Play a quiz, select answers, and view your score.

Data Storage

The project uses browser localStorage to save quiz data. The saved data remains available in the same browser unless its site data is cleared. Data is not shared automatically between different browsers or devices.

Testing

The following core workflows have been manually tested:

- Creating and saving a quiz.
- Editing a saved quiz.
- Playing a quiz and checking the score.
- Deleting a quiz.

Additional validation, responsive design, and error-handling tests should be performed before final submission.

Future Improvements

- Support multiple-correct-answer questions.
- Add short-answer and descriptive questions.
- Improve input validation and error messages.
- Add more comprehensive automated tests.

Author

GOURAV SINGLA

This project was developed as part of a frontend development learning project.