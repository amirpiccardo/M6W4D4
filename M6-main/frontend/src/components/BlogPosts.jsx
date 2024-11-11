import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const BlogPosts = ({ theme }) => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [postData, setPostData] = useState({
        category: '', title: '', cover: '', author: '', content: '', readtime: { value: 0, unit: '' },
    });
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            const response = await fetch('http://localhost:4040/blogPosts');
            const data = await response.json();
            setBlogPosts(data.blogPosts);
        } catch (error) {
            console.error("Errore durante il recupero dei post:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = selectedPost ? 'PUT' : 'POST';
        const url = selectedPost
            ? `http://localhost:4040/blogPosts/${selectedPost._id}`
            : 'http://localhost:4040/blogPosts';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });
            fetchBlogPosts();
            setPostData({ category: '', title: '', cover: '', author: '', content: '', readtime: { value: 0, unit: '' } });
            setSelectedPost(null);
        } catch (error) {
            console.error("Errore durante l'invio dei dati:", error);
        }
    };

    const handleEdit = (post) => {
        setPostData(post);
        setSelectedPost(post);
    };

    const handleDelete = async (postId) => {
        try {
            await fetch(`http://localhost:4040/blogPosts/${postId}`, { method: 'DELETE' });
            fetchBlogPosts();
        } catch (error) {
            console.error("Errore durante la cancellazione del post:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.split('.')[0] === 'readtime') {
            setPostData((prevData) => ({ ...prevData, readtime: { ...prevData.readtime, [name.split('.')[1]]: value } }));
        } else {
            setPostData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    return (
        <div className="container my-4">
            <h2>Blog Posts</h2>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className={`card p-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
                        <h5>{selectedPost ? 'Modifica Post' : 'Crea Post'}</h5>
                        <form onSubmit={handleSubmit}>
                            <input className="form-control mb-2" type="text" name="category" value={postData.category} onChange={handleInputChange} placeholder="Categoria" required />
                            <input className="form-control mb-2" type="text" name="title" value={postData.title} onChange={handleInputChange} placeholder="Titolo" required />
                            <input className="form-control mb-2" type="url" name="cover" value={postData.cover} onChange={handleInputChange} placeholder="URL Cover" />
                            <input className="form-control mb-2" type="text" name="author" value={postData.author} onChange={handleInputChange} placeholder="Autore" required />
                            <textarea className="form-control mb-2" name="content" value={postData.content} onChange={handleInputChange} placeholder="Contenuto" required />
                            <input className="form-control mb-2" type="number" name="readtime.value" value={postData.readtime.value} onChange={handleInputChange} placeholder="Tempo di Lettura" />
                            <input className="form-control mb-2" type="text" name="readtime.unit" value={postData.readtime.unit} onChange={handleInputChange} placeholder="Unità Tempo" />
                            <button className="btn btn-primary w-100" type="submit">
                                {selectedPost ? 'Aggiorna Post' : 'Crea Post'}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-md-6">
                    <ul className="list-group">
                        {blogPosts.map((post) => (
                            <li key={post._id} className={`list-group-item d-flex justify-content-between align-items-center ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                                {post.title}
                                <div>
                                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleEdit(post)}>
                                        <FaEdit />
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post._id)}>
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BlogPosts;
