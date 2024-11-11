const express = require('express');
const BlogPost = require('../models/blogPostModel');
const router = express.Router();
const cors = require('cors');
const isAuthored = require('../middlewares/isAuthored');
router.use(cors());

router.get('/blogPosts', async (req, res) => {
    const { page = 1, pageSize = 9, title } = req.query;
    const query = title ? { title: new RegExp(title, 'i') } : {}; // ricerca per titolo
    console.log(`Eseguita ricerca con query: ${JSON.stringify(query)}`);
    try {
        const totalPosts = await BlogPost.countDocuments(query);
        const blogPosts = await BlogPost.find(query)
            .limit(parseInt(pageSize))
            .skip((page - 1) * pageSize);
        res.json({ blogPosts, totalPosts, totalPages: Math.ceil(totalPosts / pageSize) });
    } catch (error) {
        console.error('Errore durante la ricerca:', error);
        res.status(500).json({ message: 'Errore durante la ricerca.' });
    }
});

router.get('/search', async (req, res) => {
    const { query } = req.query;
    
    console.log(`Query ricevuta per la ricerca: "${query}"`);
    
    if (!query) {
        return res.json([]);  // Nessun risultato se non c'è query
    }

    try {
        const results = await BlogPost.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        });

        console.log(`Risultati trovati: ${results.length}`);
        
        res.json(results);
    } catch (error) {
        console.error('Errore durante la ricerca:', error);
        res.status(500).json({ message: 'Errore durante la ricerca.' });
    }
});

router.get('/blogPosts/:id', async (req, res) => {
    const blogPost = await BlogPost.findById(req.params.id);
    res.json(blogPost);
});

router.post('/blogPosts', async (req, res) => {
    const newBlogPost = new BlogPost(req.body);
    await newBlogPost.save();
    res.status(201).json(newBlogPost);
});

router.put('/blogPosts/:id', async (req, res) => {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBlogPost);
});

router.delete('/blogPosts/:id', async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

router.get('/authors/:id/blogPosts', async (req, res) => {
    const authorEmail = req.params.id;
    const blogPosts = await BlogPost.find({ author: authorEmail });
    res.json(blogPosts);
});

router.get('/blogPosts/:id/comments', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato.");
    res.json(post.comments);
});

router.get('/blogPosts/:id/comments/:commentId', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato.");
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send("Commento non trovato.");
    res.json(comment);
});

router.post('/blogPosts/:id/comments', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato.");
    post.comments.push(req.body);
    await post.save();
    res.status(201).json(post.comments[post.comments.length - 1]);
});

router.put('/blogPosts/:id/comments/:commentId', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato.");
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send("Commento non trovato.");
    comment.text = req.body.text || comment.text;
    comment.author = req.body.author || comment.author;
    await post.save();
    res.json(comment);
});

router.delete('/blogPosts/:id/comments/:commentId', async (req, res) => {
    const updatedPost = await BlogPost.findByIdAndUpdate(
        req.params.id,
        {
            $pull: { comments: { _id: req.params.commentId } }
        },
        { new: true }
    );
    if (!updatedPost) return res.status(404).send("Post non trovato.");
    res.status(204).send();
});

module.exports = router;
