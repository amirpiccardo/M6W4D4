const UserModel = require('../models/UserModel')
const bcrypt = require('bcrypt');

const isAuthored =async  (req, res, next) => {
        try {
            // Ottieni l'header Authorization
            const authHeader = req.headers.authorization;
    
            if (!authHeader) {
                return res.status(401).json({
                    message: "Authorization header mancante",
                    statusCode: 401
                });
            }
    
            // Verifica che sia Basic auth
            if (!authHeader.startsWith('Basic ')) {
                return res.status(401).json({
                    message: "Formato autorizzazione non valido",
                    statusCode: 401
                });
            }
    
            // Decodifica le credenziali
            const base64Credentials = authHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
            const [email, password] = credentials.split(':');
    
            // Verifica l'utente nel database
            const user = await UserModel.findOne({ email });
            
            if (!user) {
                return res.status(401).json({
                    message: "Credenziali non valide",
                    statusCode: 401
                });
            }
    
            // Verifica la password (assumendo che usi bcrypt)
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Credenziali non valide",
                    statusCode: 401
                });
            }
    
            // Aggiungi l'utente al request object
            req.user = {
                _id: user._id,
                email: user.email,
                userName: user.userName
                // altri campi che vuoi passare
            };
    
            next();
        } catch (error) {
            return res.status(500).json({
                message: "Errore durante l'autenticazione",
                statusCode: 500,
                error: error.message
            });
        }
}


module.exports = isAuthored

