// routes/authors.js
const express = require('express');
const Author = require('../models/authorModel');
const sgMail = require('@sendgrid/mail'); // Importa il modulo SendGrid
const router = express.Router();
const cors = require('cors');

router.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/authors', async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const authors = await Author.find()
        .limit(parseInt(pageSize))
        .skip((page - 1) * pageSize);
    res.json({ authors });
});

router.get('/authors/:id', async (req, res) => {
    const author = await Author.findById(req.params.id);
    res.json(author);
});

router.post('/authors', async (req, res) => {
    try {
        const newAuthor = new Author(req.body);
        await newAuthor.save();

        const msg = {
            to: newAuthor.email,  
            from:'amirpiccardo@gmail.com',  
            subject: 'Benvenuto!',  
            text: `Ciao ${newAuthor.nome}, benvenuto nel nostro sistema!`,  
        };

        console.log("Email message to be sent:", msg);
        await sgMail.send(msg); 

        console.log("Email inviata con successo:", msg); 

        res.status(201).json(newAuthor); 
    } catch (error) {
        console.error("Errore durante l'invio dell'email:", error.response ? error.response.body : error);
        res.status(500).send({
            statusCode: 500,
            message: 'Errore durante la creazione dell\'autore'
        });
    }
});



router.put('/authors/:id', async (req, res) => {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAuthor);
});

router.delete('/authors/:id', async (req, res) => {
    await Author.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

module.exports = router;
