// BlogPostDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Form, ListGroup } from "react-bootstrap";
import { BsHeart, BsChat, BsPencilSquare, BsTrash } from "react-icons/bs";

const BlogPostDetail = ({ theme }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: "", text: "" });
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [likes, setLikes] = useState(0);
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:4040/blogPosts/${id}`);
      const data = await response.json();
      setPost(data);
      setLikes(data.likes || 0);
    } catch (error) {
      console.error("Errore durante il recupero del post:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:4040/blogPosts/${id}/comments`
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Errore durante il recupero dei commenti:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:4040/blogPosts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        }
      );
      const data = await response.json();
      setComments([...comments, data]);
      setNewComment({ author: "", text: "" });
      setShowCommentForm(false);
    } catch (error) {
      console.error("Errore durante l'aggiunta del commento:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await fetch(
        `http://localhost:4040/blogPosts/${id}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Errore durante l'eliminazione del commento:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setNewComment({ author: comment.author, text: comment.text });
    setShowCommentForm(true);
  };

  const handleUpdateComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:4040/blogPosts/${id}/comments/${editingComment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        }
      );
      const updatedComment = await response.json();
      setComments(
        comments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
      setEditingComment(null);
      setNewComment({ author: "", text: "" });
      setShowCommentForm(false);
    } catch (error) {
      console.error("Errore durante l'aggiornamento del commento:", error);
    }
  };

  const handleLike = async () => {
    try {
      await fetch(`http://localhost:4040/blogPosts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: likes + 1 }),
      });
      setLikes(likes + 1);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei mi piace:", error);
    }
  };

  if (!post) return <div>Caricamento...</div>;

  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} md={7} className="text-start">
          <h1 className={theme === "dark" ? "text-light" : "text-dark"}>
            {post.title}
          </h1>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ color: theme === "dark" ? "#e0e0e0" : "#4a4a4a" }}>
              {post.author}
            </span>
          </div>
          <img
            src={post.cover}
            alt={post.title}
            className="img-fluid rounded mb-4"
            style={{ maxWidth: "100%" }}
          />
          <p
            className={`mx-auto ${
              theme === "dark" ? "text-light" : "text-dark"
            }`}
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.6",
              textAlign: "justify",
            }}
          >
            {post.content}
          </p>
          <div className="d-flex align-items-center mt-3">
            <BsHeart
              onClick={handleLike}
              style={{ cursor: "pointer", color: "red", marginRight: "8px" }}
            />
            <span>{likes}</span>
          </div>
        </Col>

        <Col lg={4} md={5}>
          <h3 className="mt-3">Commenti</h3>
          <ListGroup className="mb-4">
            {comments.map((comment) => (
              <ListGroup.Item
                key={comment._id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{comment.author}</strong>
                  <p>{comment.text}</p>
                </div>
                <div className="d-flex">
                  <BsPencilSquare
                    onClick={() => handleEditComment(comment)}
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                      color: "blue",
                    }}
                  />
                  <BsTrash
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button
              variant="outline-secondary"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              <BsChat /> {editingComment ? "Modifica Commento" : "Commenta"}
            </Button>
          </div>

          {showCommentForm && (
            <Form>
              <Form.Group controlId="author">
                <Form.Label>Autore</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Il tuo nome"
                  value={newComment.author}
                  onChange={(e) =>
                    setNewComment({ ...newComment, author: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="text">
                <Form.Label>Commento</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Scrivi il tuo commento"
                  value={newComment.text}
                  onChange={(e) =>
                    setNewComment({ ...newComment, text: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={
                  editingComment ? handleUpdateComment : handleAddComment
                }
                className="mt-3"
              >
                {editingComment ? "Aggiorna Commento" : "Aggiungi Commento"}
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPostDetail;
