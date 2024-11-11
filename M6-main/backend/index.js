require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Aggiungi questa importazione
const authorsRouter = require('./routes/authors');
const blogPostsRouter = require('./routes/blogPosts');
const uploadRouter = require('./routes/upload');
const emailRoute = require('./routes/sendEmail');
const usersRoute = require('./routes/users');
const githubRoute = require('./routes/github');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',  // Consenti solo il dominio del frontend
    methods: 'GET,POST,PUT,DELETE',  // Metodi consentiti
    allowedHeaders: 'Content-Type,Authorization',  // Headers consentiti
};
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Timeout di 30 secondi
  })
  .then(() => console.log('Connesso a MongoDB'))
  .catch(err => console.error('Errore di connessione a MongoDB:', err));

app.use(express.json());
app.use(cors());
app.use('', authorsRouter);
app.use('', blogPostsRouter);
app.use('', uploadRouter);
app.use('', emailRoute);
app.use('', usersRoute);
app.use('',githubRoute);

const port = process.env.PORT || 4040;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
