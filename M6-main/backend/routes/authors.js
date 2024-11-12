const express = require("express");
const Author = require("../models/authorModel");
const BlogPost = require("../models/blogPostModel");
const sgMail = require("@sendgrid/mail");
const router = express.Router();
const cors = require("cors");

router.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Endpoint per ottenere la lista degli autori con paginazione
router.get("/authors", async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const authors = await Author.find()
      .limit(parseInt(pageSize))
      .skip((page - 1) * pageSize);
    res.json({ authors });
  } catch (error) {
    console.error("Errore durante il recupero degli autori:", error);
    res
      .status(500)
      .json({ message: "Errore durante il recupero degli autori" });
  }
});

// Endpoint per ottenere i dettagli di un autore e i suoi post, tramite l'ID dell'autore
router.get("/authors/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: "Autore non trovato" });

    const authorPosts = await BlogPost.find({ author: author.email }); // Usa l'email per cercare i post dell'autore
    res.json({ author, posts: authorPosts });
  } catch (error) {
    console.error(
      "Errore durante il recupero dei dettagli dell'autore:",
      error
    );
    res
      .status(500)
      .json({ message: "Errore durante il recupero dei dettagli dell'autore" });
  }
});

// **Modifica**: Endpoint per ottenere i dettagli di un autore tramite il nome
router.get("/authorsByName/:nome", async (req, res) => {
  const { nome } = req.params;
  try {
    const author = await Author.findOne({ nome: nome }); // Cerca l'autore per nome
    if (!author) return res.status(404).json({ message: "Autore non trovato" });

    const authorDetails = {
      nome: author.nome,
      cognome: author.cognome,
      avatar: author.avatar,
    };

    const authorPosts = await BlogPost.find({ author: author.email });
    res.json({ author: authorDetails, posts: authorPosts });
  } catch (error) {
    console.error(
      "Errore durante il recupero dei dettagli dell'autore:",
      error
    );
    res
      .status(500)
      .json({ message: "Errore durante il recupero dei dettagli dell'autore" });
  }
});

// Endpoint per creare un nuovo autore
router.post("/authors", async (req, res) => {
  try {
    // Check se l'email è già in uso
    const existingAuthor = await Author.findOne({ email: req.body.email });
    if (existingAuthor) {
      return res.status(409).json({ message: "Email già utilizzata" });
    }

    const newAuthor = new Author(req.body);
    await newAuthor.save();

    const msg = {
      to: newAuthor.email,
      from: "amirpiccardo@gmail.com",
      subject: "Benvenuto!",
      text: `Ciao ${newAuthor.nome}, l'aggiunta del nuovo autore é avvenuta con successo!`,
    };

    await sgMail.send(msg);
    res.status(201).json(newAuthor);
  } catch (error) {
    console.error(
      "Errore durante l'invio dell'email:",
      error.response ? error.response.body : error
    );
    res.status(500).send({
      statusCode: 500,
      message: "Errore durante la creazione dell'autore",
    });
  }
});

// Endpoint per eliminare un autore
router.delete("/authors/:id", async (req, res) => {
  try {
    await Author.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Errore durante l'eliminazione dell'autore:", error);
    res
      .status(500)
      .json({ message: "Errore durante l'eliminazione dell'autore" });
  }
});

module.exports = router;
