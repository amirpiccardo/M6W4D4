const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accesso negato: ruolo non autorizzato" });
    }
    next();
  };
};

module.exports = authorizeRoles;
