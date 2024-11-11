const badRequestHandler = (err, req, res, next) => {
    console.log(err)
    if (err.statusCode === 400) {
        res
            .status(400)
            .send({
                message: err.message,
                errors: err.errorsList.map(e => e.msg)
            })
    } else {
        next(err)
    }
}

module.exports = badRequestHandler

