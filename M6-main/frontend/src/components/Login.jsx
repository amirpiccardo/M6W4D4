import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { BsGithub } from "react-icons/bs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const success = searchParams.get("success");

  useEffect(() => {
    if (token) {
      console.log("Token trovato:", token);
      localStorage.setItem("token", token);
      setSuccessMessage("Login avvenuto con successo, puoi tornare alla home!");
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (success === "true") {
      setSuccessMessage("Login avvenuto con successo, puoi tornare alla home!");
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4040/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError("Errore nella connessione al server.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Login</h2>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Accedi
        </button>
      </form>
      <p className="mt-3">
        Non hai un account? <Link to="/register">Registrati qui</Link>
      </p>
      <div className="mt-3">
        <a href="http://localhost:4040/auth/github" className="btn btn-dark">
          <BsGithub /> Login con GitHub
        </a>
      </div>
    </div>
  );
};

export default Login;
