import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BlogPostsPreview from "./components/BlogPostsPreview";
import BlogPostDetail from "./components/BlogPostDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import Authors from "./components/Authors";
import BlogPosts from "./components/BlogPosts";
import SearchResults from "./components/SearchResults";
import Success from "./components/Success";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className =
      theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  return (
    <BrowserRouter>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className={`layout ${theme}`}>
        <Routes>
          <Route path="/" element={<BlogPostsPreview theme={theme} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults theme={theme} />} />
          <Route
            path="/blog-posts/:id"
            element={<BlogPostDetail theme={theme} />}
          />

          <Route element={<PrivateRoute />}>
            <Route path="/authors" element={<Authors theme={theme} />} />
            <Route path="/blog-posts" element={<BlogPosts theme={theme} />} />
          </Route>
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
