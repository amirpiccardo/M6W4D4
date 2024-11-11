// routes/upload.js
const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const sgMail = require('@sendgrid/mail');
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'EPISERVERUPLOADS', allowed_formats: ['jpg', 'png'] }
});

const upload = multer({ storage });

router.patch('/authors/:id/avatar', upload.single('avatar'), async (req, res) => {
    const author = await Author.findByIdAndUpdate(req.params.id, { avatar: req.file.path }, { new: true });
    res.json(author);
});

router.patch('/blogPosts/:id/cover', upload.single('cover'), async (req, res) => {
    const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, { cover: req.file.path }, { new: true });
    res.json(blogPost);
});

router.post('/notify', async (req, res) => {
    const { email, subject, message } = req.body;
    const msg = { to: email, from: 'noreply@example.com', subject, text: message };
    await sgMail.send(msg);
    res.status(200).send("Notification Sent");
});

module.exports = router;
