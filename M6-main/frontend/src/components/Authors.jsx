import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Authors = ({ theme }) => {
    const [authors, setAuthors] = useState([]);
    const [authorData, setAuthorData] = useState({
        nome: '', cognome: '', email: '', dataDiNascita: '', avatar: ''
    });
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await fetch('http://localhost:4040/authors');
            const data = await response.json();
            setAuthors(data.authors);
        } catch (error) {
            console.error("Errore durante il recupero degli autori:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = selectedAuthor ? 'PUT' : 'POST';
        const url = selectedAuthor
            ? `http://localhost:4040/authors/${selectedAuthor._id}`
            : 'http://localhost:4040/authors';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authorData),
            });
            fetchAuthors();
            setAuthorData({ nome: '', cognome: '', email: '', dataDiNascita: '', avatar: '' });
            setSelectedAuthor(null);
        } catch (error) {
            console.error("Errore durante l'invio dei dati:", error);
        }
    };

    const handleEdit = (author) => {
        setAuthorData(author);
        setSelectedAuthor(author);
    };

    const handleDelete = async (authorId) => {
        try {
            await fetch(`http://localhost:4040/authors/${authorId}`, { method: 'DELETE' });
            fetchAuthors();
        } catch (error) {
            console.error("Errore durante la cancellazione dell'autore:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAuthorData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="container my-4">
            <h2>Autori</h2>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className={`card p-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
                        <h5>{selectedAuthor ? 'Modifica Autore' : 'Crea Autore'}</h5>
                        <form onSubmit={handleSubmit}>
                            <input className="form-control mb-2" type="text" name="nome" value={authorData.nome} onChange={handleInputChange} placeholder="Nome" required />
                            <input className="form-control mb-2" type="text" name="cognome" value={authorData.cognome} onChange={handleInputChange} placeholder="Cognome" required />
                            <input className="form-control mb-2" type="email" name="email" value={authorData.email} onChange={handleInputChange} placeholder="Email" required />
                            <input className="form-control mb-2" type="date" name="dataDiNascita" value={authorData.dataDiNascita} onChange={handleInputChange} required />
                            <input className="form-control mb-2" type="url" name="avatar" value={authorData.avatar} onChange={handleInputChange} placeholder="URL Avatar" />
                            <button className="btn btn-primary w-100" type="submit">
                                {selectedAuthor ? 'Aggiorna Autore' : 'Crea Autore'}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-md-6">
                    <ul className="list-group">
                        {authors.map((author) => (
                            <li key={author._id} className={`list-group-item d-flex justify-content-between align-items-center ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                                {author.nome} {author.cognome}
                                <div>
                                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleEdit(author)}>
                                        <FaEdit /> {/* Icona di modifica */}
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(author._id)}>
                                        <FaTrashAlt /> {/* Icona di eliminazione */}
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

export default Authors;
