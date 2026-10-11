Quiz Platform 🎯

Project Overview

Quiz Platform is a responsive web application built using React that allows users to create, manage, edit, delete, and play quizzes. Users can add different types of questions, submit answers, view automatically graded results, and submit descriptive answers for manual review.

The application provides a simple and user-friendly interface for creating and attempting quizzes. Quiz data is stored in the browser's localStorage, so users can access their saved quizzes again in the same browser.

Live Demo

https://quiz-platform-iota-five.vercel.app

GitHub Repository

https://github.com/GOURAV27D/quiz-platform

Features

- User Authentication Interface: Login and registration interface with input validation.
- Home Dashboard: Navigate to Create Quiz, My Quizzes, and Play Quiz.
- Create Quiz: Create quizzes with a title and multiple questions.
- Multiple Question Types: Supports single-choice MCQs, multiple-correct MCQs, short-answer questions, and descriptive questions.
- Question Options: Add answer options and select the correct answer for objective questions.
- Form Validation: Validates quiz titles, question text, answer options, and required answers.
- My Quizzes: View all saved quizzes.
- Edit Quizzes: Update existing quiz titles, questions, and answers.
- Delete Quizzes: Remove unwanted quizzes.
- Play Quiz: Attempt saved quizzes and navigate through questions.
- Automatic Scoring: Automatically checks supported objective and short-answer questions.
- Descriptive Answers: Collects descriptive responses for manual review rather than automatically grading them.
- Result Summary: Displays submitted answers and automatically graded results.
- Local Data Storage: Saves quiz data using browser localStorage.
- Responsive Interface: Provides a layout designed to work across different screen sizes.

Technologies Used

- React.js
- JavaScript
- HTML5
- CSS3
- React Router DOM
- Redux
- React Redux
- Redux Thunk
- Material UI (MUI)
- Browser localStorage
- Vite
- Git and GitHub
- Vercel

Project Folder Structure

Quiz Platform/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Authentication.jsx
│   │   ├── Home.jsx
│   │   ├── CreateQuiz.jsx
│   │   ├── MyQuizzes.jsx
│   │   ├── EditQuiz.jsx
│   │   ├── PlayQuiz.jsx
│   │   └── ResultQuiz.jsx
│   ├── redux/
│   │   ├── quizActions.js
│   │   └── store.js
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js

Installation and Setup

Follow these steps to run the project on your computer.

1. Clone the Repository

git clone https://github.com/GOURAV27D/quiz-platform.git

2. Open the Project Folder

cd quiz-platform

3. Install Dependencies

npm install

4. Start the Development Server

npm run dev

5. Open the Application

Open the local URL displayed in the terminal, usually:

http://localhost:5173

How to Use

1. Open the Quiz Platform website.
2. Use the authentication interface to access the application.
3. Navigate to the home dashboard.
4. Select Create Quiz to create a new quiz.
5. Enter a quiz title and add questions with their answers.
6. Save the quiz to your collection.
7. Open My Quizzes to view, edit, or delete saved quizzes.
8. Select a quiz to play it.
9. Answer the questions and finish the quiz.
10. View your result summary and submitted answers.

Data Storage

The application uses the browser's localStorage to store quiz data. This allows saved quizzes to remain available in the same browser after refreshing or reopening the website.

The project does not use a backend server or cloud database. Therefore, quiz data is not automatically synchronized between different browsers or devices. Clearing the browser's site data may remove saved quizzes.

Validation and Error Handling

The application includes validation to help users enter valid information.

- Quiz titles must meet the configured character limits.
- Questions must meet the configured character limits.
- Required fields must be completed.
- Multiple-choice questions must contain valid answer options.
- Duplicate options are prevented where applicable.
- Correct answers must match the available options.
- Users must provide an answer before proceeding to the next question.
- Errors during quiz saving are handled with an error message.

Testing

The following workflows should be tested before final submission:

- Creating and saving a quiz.
- Creating each supported question type.
- Checking required-field and character-limit validation.
- Playing a quiz and checking objective-question scoring.
- Submitting a short answer.
- Submitting a descriptive answer for manual review.
- Editing a saved quiz.
- Deleting a quiz and confirming its removal.
- Refreshing the website and checking saved data.
- Testing the layout on desktop and mobile screen sizes.
- Opening the deployed website and checking for runtime errors.

Only mark a test as passed after verifying it in the running application.

Deployment

The application is deployed using Vercel.

Live website: https://quiz-platform-iota-five.vercel.app

Source code: https://github.com/GOURAV27D/quiz-platform

The source code is maintained in a public GitHub repository. New changes can be committed and pushed to GitHub, after which Vercel can deploy the updated version.

Future Improvements

- Add a backend and database for permanent cloud storage.
- Implement secure user accounts and authentication.
- Synchronize quizzes between devices.
- Add quiz timers and question randomization.
- Add automated testing for components and quiz workflows.
- Improve accessibility and provide more detailed analytics.

Conclusion

Quiz Platform demonstrates the use of React, JavaScript, routing, Redux state management, form validation, browser storage, and responsive UI design. It provides a practical way to create, manage, and attempt quizzes through a simple web interface.

Author

Gourav Singla

Frontend Development Capstone Project — AlmaBetter