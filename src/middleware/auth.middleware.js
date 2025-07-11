const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authHeaderVal = req.get("Authorization");

  if (!authHeaderVal || !authHeaderVal.startsWith("Bearer ")
  ) {
    return res.status(401).json({ "status": "ERROR", "message": "No authentication token found" });
  }

  let token = authHeaderVal.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;

    next();
  }
  catch (err) {
    return res.status(403).json({ "status": "ERROR", "message": "Invalid or expired token" });
  }

}

module.exports = authenticateToken;
