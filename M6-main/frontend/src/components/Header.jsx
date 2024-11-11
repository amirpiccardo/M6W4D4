import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
import { BsMoon, BsSun, BsBoxArrowRight } from "react-icons/bs"; // Icone per logout, tema e GitHub

const Header = ({ theme, toggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    localStorage.setItem("searchQuery", query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Verifica che la query non sia vuota
    if (searchQuery.trim()) {
      // Salva la query in localStorage
      localStorage.setItem("searchQuery", searchQuery);
      // Naviga alla pagina dei risultati della ricerca
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleHomeClick = () => {
    setSearchQuery("");
    localStorage.removeItem("searchQuery");
    navigate("/");
  };

  return (
    <Navbar bg={theme === "dark" ? "dark" : "light"} variant={theme === "dark" ? "dark" : "light"} expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleHomeClick}>Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/authors">Autori</Nav.Link>
            <Nav.Link as={Link} to="/blog-posts">Blog Posts</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Button variant="outline-danger" onClick={handleLogout}>
              <BsBoxArrowRight />
            </Button>
          </Nav>
          <Form className="d-flex ms-auto" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Cerca articoli..."
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchInput}
            />
            <Button type="submit" variant="outline-success">
              Cerca
            </Button>
          </Form>
          <Button variant="outline-secondary" onClick={toggleTheme} className="ms-2">
            {theme === "dark" ? <BsSun /> : <BsMoon />}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
