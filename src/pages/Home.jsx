import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();
  const quizzes = useSelector((state) => state.quizzes);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const actions = [
    {
      icon: "➕",
      title: "Create Quiz",
      description: "Build your own quiz with questions and multiple options.",
      button: "Create Now",
      path: "/create-quiz",
    },
    {
      icon: "🎮",
      title: "Play Quiz",
      description: "Challenge yourself, test your knowledge, and check your score.",
      button: "Play Now",
      path: "/play-quiz",
    },
    {
      icon: "📊",
      title: "My Quizzes",
      description: "View, edit, and manage all your created quizzes.",
      button: "View Quizzes",
      path: "/my-quizzes",
    },
  ];

  const stats = [
    {
      icon: "📚",
      value: quizzes.length,
      label: "Total Quizzes",
    },
    {
      icon: "🎯",
      value: quizzes.length > 0 ? "Ready" : "Empty",
      label: "Quiz Status",
    },
    {
      icon: "🚀",
      value: "Let's Go!",
      label: "Your Progress",
    },
  ];

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2 className="brand">
          Quiz Platform <span>🎯</span>
        </h2>

        <div className="nav-actions">
          <button
            className="nav-btn"
            onClick={() => navigate("/my-quizzes")}
          >
            📚 My Quizzes
          </button>

          <button
            className="nav-btn logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <section className="hero">
          <span className="hero-label">YOUR LEARNING SPACE</span>
          <h1>Welcome to Quiz Platform 🎉</h1>
          <p>
            Create, play, and manage your quizzes—all in one place.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/create-quiz")}
            >
              ➕ Create a Quiz
            </button>

            <button
              className="btn btn-outline"
              onClick={() => navigate("/play-quiz")}
            >
              ▶️ Play Quiz
            </button>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <span className="stat-icon">{stat.icon}</span>
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="quick-section">
          <div className="section-heading">
            <span>MAKE IT HAPPEN</span>
            <h2>Quick Actions</h2>
            <p>What would you like to do today?</p>
          </div>

          <div className="actions-grid">
            {actions.map((action) => (
              <article className="action-card" key={action.title}>
                <div className="action-icon">{action.icon}</div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>

                <button
                  className="btn btn-card"
                  onClick={() => navigate(action.path)}
                >
                  {action.button} →
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        © 2026 Quiz Platform 🎯{" "}
        <span>Made for curious minds.</span>
      </footer>
    </div>
  );
}

export default Home;