const { body, validationResult } = require('express-validator')

const validateUserBody = [
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Capra! la mail non è corretta'),

    body('password')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Attenzione, la password deve contenere almeno 8 caratteri'),

    body('userName')
        .notEmpty()
        .isString()
        .isLength({ min: 1 })
        .withMessage('Attenzione, username deve contenere almeno 1 carattere'),

    body('isActive')
        .isBoolean()
        .withMessage('Attenzione, isActive deve essere true o false'),

    body('dob')
        .isDate()
        .withMessage('Attenzione, dob deve essere una data'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .send({ errors: errors.array() })
        }

        next()
    }
]

module.exports = { validateUserBody}
