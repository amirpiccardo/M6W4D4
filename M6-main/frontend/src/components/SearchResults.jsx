import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { BsBook, BsHeart, BsArrowLeft, BsArrowRight } from "react-icons/bs";

const SearchResults = ({ theme }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const postsPerPage = 9; // Limite di 9 post per pagina

  useEffect(() => {
    if (query) {
      fetchSearchResults(query, currentPage);
    }
  }, [query, currentPage]);

  const fetchSearchResults = async (query, page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4040/search?query=${query}&page=${page}&pageSize=${postsPerPage}` // Aggiunto pageSize
      );
      if (!response.ok) throw new Error(`Errore: ${response.status}`);
      const data = await response.json();

      setResults(data.blogPosts || data);
      setTotalPosts(data.totalPosts || 0); // Usa totalPosts per paginazione
      setTotalPages(data.totalPages || 0); // Aggiungi totalPages
    } catch (error) {
      console.error("Errore durante la ricerca:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:4040/blogPosts/${postId}/like`,
        {
          method: "PUT",
        }
      );

      if (!response.ok)
        throw new Error("Errore durante l'incremento dei mi piace");

      const data = await response.json();
      setResults(
        results.map((post) =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
      );
    } catch (error) {
      console.error("Errore durante il like:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Caricamento...</div>;
  if (!results.length) return <div>Nessun post trovato.</div>;

  return (
    <div className="container my-4">
      <h2>Risultati della Ricerca</h2>
      <div className="row">
        {results.map((post) => (
          <div className="col-md-4" key={post._id}>
            <div
              className={`card mb-4 ${
                theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
              }`}
            >
              <img src={post.cover} alt={post.title} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.content.substring(0, 100)}...</p>
                <p className="card-text">
                  <small className="text-muted">
                    {post.author} - Tempo di Lettura: {post.readtime.value}{" "}
                    {post.readtime.unit}
                  </small>
                </p>
                <Link
                  to={`/blog-posts/${post._id}`}
                  className={`btn ${
                    theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
                  }`}
                >
                  <BsBook /> Leggi di più
                </Link>
                <div className="d-flex justify-content-end align-items-center mt-2">
                  <BsHeart
                    onClick={() => handleLike(post._id)}
                    style={{
                      cursor: "pointer",
                      color: "red",
                      marginRight: "5px",
                    }}
                  />
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginazione con le icone */}
      <div className="pagination-container">
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <BsArrowLeft /> {/* Freccia sinistra */}
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              )
            )}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <BsArrowRight /> {/* Freccia destra */}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SearchResults;
