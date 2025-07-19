const authorizeAdmin = (req, res, next) => {

  const role = req.user.role;

  if (role !== "ADMIN") {
    return res.status(403).json({ "status": "ERROR", "message": "You do not have permission to perform this action" });
  }
  else {
    next();
  }

};

module.exports = authorizeAdmin;
