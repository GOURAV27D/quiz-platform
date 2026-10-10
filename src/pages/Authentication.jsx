import  { useState } from "react";
import  { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

function Authentication() {
    const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Login
    if (isLogin) {
      if (!email || !password) {
        setError("Please enter email and password.");
        return;
      }

      const savedUser = JSON.parse(
        localStorage.getItem("quizUser")
      );

      if (!savedUser) {
        setError("No account found. Please create an account first.");
        return;
      }

      if (
        savedUser.email !== email ||
        savedUser.password !== password
      ) {
        setError("Invalid email or password.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");

      setSuccess("Login successful!");
      navigate("/home");

      // Later we will redirect to Home here.
      return;
    }

    // Create account
    if (!name || !email || !password) {
      setError("Please fill all the fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const user = {
      name,
      email,
      password,
    };

    localStorage.setItem("quizUser", JSON.stringify(user));

    setSuccess("Account created successfully! You can now login.");

    setName("");
    setEmail("");
    setPassword("");

    setIsLogin(true);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: { xs: 3, sm: 5 },
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Quiz Platform 🎯
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {isLogin
              ? "Login to continue your quiz journey"
              : "Create your Quiz Platform account"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
              />
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </Box>

          <Typography
            align="center"
            sx={{ mt: 3 }}
            color="text.secondary"
          >
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </Typography>

          <Button
            fullWidth
            onClick={switchMode}
            sx={{ mt: 1 }}
          >
            {isLogin ? "Create an Account" : "Login Instead"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Authentication;