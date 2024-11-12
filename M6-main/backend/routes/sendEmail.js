const express = require("express");
const sgMail = require("@sendgrid/mail");
const Author = require("../models/authorModel");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

router.post("/authors", async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();

    const msg = {
      to: process.env.SENDGRID_SENDER,
      from: "amirpiccardodev@gmail.com",
      subject: "Nuovo autore aggiunto",
      text: `È stato aggiunto un nuovo autore: ${newAuthor.name} (${newAuthor.email}).`,
    };

    await sgMail.send(msg);

    res.status(201).send(newAuthor);
  } catch (error) {
    console.error("Errore durante la creazione dell'autore:", error);
    res.status(500).send({
      statusCode: 500,
      message: "Errore durante la creazione dell’autore",
    });
  }
});

module.exports = router;
