const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/UserModel');
const logger = require('../middlewares/logger');

const users = express.Router();

// Middleware di validazione dei dati utente
const validateUserBody = [
    body('email').isEmail().withMessage('Email non valida'),
    body('password').isLength({ min: 8 }).withMessage('Password di almeno 8 caratteri'),
    body('userName').notEmpty().withMessage('Username richiesto'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Registrazione Utente
users.post('/users/create', validateUserBody, async (req, res) => {
    const { email, password, userName, dob } = req.body;

    try {
        // Verifica se l'email è già registrata
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Questa email è già registrata' });
        }

        // Hash della password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crea un nuovo utente con il ruolo 'user' di default
        const newUser = new UserModel({ email, password: hashedPassword, userName, dob, role: 'user' });
        const userToSave = await newUser.save();

        res.status(201).json({
            message: 'Registrazione completata con successo',
            userToSave
        });
    } catch (e) {
        console.error('Errore durante la registrazione:', e);
        res.status(500).json({ message: 'Errore durante la registrazione' });
    }
});

// Login Utente
users.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login effettuato con successo',
            token
        });
    } catch (error) {
        console.error('Errore durante il login:', error);
        res.status(500).json({ error: error.message });
    }
});

// Middleware di Autenticazione tramite JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token non valido' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Autenticazione richiesta' });
    }
};

// Middleware di autorizzazione per ruolo
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accesso negato: ruolo non autorizzato' });
        }
        next();
    };
};

// Rotta per cambiare ruolo (solo per admin)
users.patch('/users/role/:userId', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'editor'].includes(role)) {
        return res.status(400).json({ message: 'Ruolo non valido' });
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { role }, { new: true });
        res.status(200).json({
            message: `Ruolo aggiornato con successo a ${role}`,
            updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Profilo Utente (Protetto da JWT)
users.get('/users/profile', authenticateJWT, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userId).select('-password');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotte CRUD esistenti (senza modifiche)
users.get('/users', logger, async (req, res, next) => {
    const { page, pageSize = 10 } = req.query;
    try {
        const users = await UserModel.find()
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .sort({ userName: -1 });

        const totalUser = await UserModel.countDocuments();
        const totalPages = Math.ceil(totalUser / pageSize);

        if (users.length === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: 'No users found'
            });
        }

        res.status(200).send({
            statusCode: 200,
            count: totalUser,
            totalPages,
            users
        });
    } catch (e) {
        next(e);
    }
});

// Modifica Utente (come esempio di protezione per admin o editor)
users.patch('/users/update/:userId', authenticateJWT, authorizeRoles('admin', 'editor'), async (req, res, next) => {
    const { userId } = req.params;
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const updatedUser = { ...req.body, password: hashedPassword };

        const options = { new: true };
        const userToUpdate = await UserModel.findByIdAndUpdate(userId, updatedUser, options);

        res.status(200).send({
            statusCode: 200,
            message: `User with id ${userId} updated successfully`,
            userToUpdate
        });
    } catch (error) {
        next(error);
    }
});

// Elimina Utente (esempio: accesso solo a admin)
users.delete('/users/delete/:userId', authenticateJWT, authorizeRoles('admin'), async (req, res, next) => {
    const { userId } = req.params;
    try {
        await UserModel.findByIdAndDelete(userId);
        res.status(200).send({
            statusCode: 200,
            message: `User with id ${userId} deleted successfully`
        });
    } catch (error) {
        next(error);
    }
});

module.exports = users;
