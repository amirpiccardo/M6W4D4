import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsBook, BsHeart, BsArrowLeft, BsArrowRight } from "react-icons/bs";

const BlogPostsPreview = ({ theme }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://blogepic.onrender.com/blogPosts?page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok)
          throw new Error(`Errore: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setPosts(
          data.blogPosts.map((post) => ({ ...post, likes: post.likes || 0 }))
        );
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Errore durante il recupero dei post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, pageSize]);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post._id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <div>Caricamento...</div>;
  if (!posts.length) return <div>Nessun post trovato.</div>;

  return (
    <div className="container my-4">
      <h2>Articoli Recenti</h2>
      <div className="row">
        {posts.map((post) => (
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
                    <Link
                      to={`/authors/${post.authorId}`}
                      className="text-decoration-none text-reset"
                    >
                      {post.author}
                    </Link>{" "}
                    - Tempo di Lettura: {post.readtime.value}{" "}
                    {post.readtime.unit}
                  </small>
                </p>
                <Link
                  to={`/blog-posts/${post._id}`}
                  className="btn btn-primary"
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
      <div className="pagination d-flex justify-content-between">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="btn btn-secondary"
        >
          <BsArrowLeft />
        </button>
        <span>
          Pagina {page} di {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="btn btn-secondary"
        >
          <BsArrowRight />
        </button>
      </div>
    </div>
  );
};

export default BlogPostsPreview;
