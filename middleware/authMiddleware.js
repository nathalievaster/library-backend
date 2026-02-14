const jwt = require("jsonwebtoken")

// Middleware för att skydda routes
module.exports = function (req, res, next) {
    // hämta token från headern
  const token = req.header("Authorization")?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    // Verifierar token och hämtar användarinfo
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // lägg till användarinfo i request-objektet
    req.user = decoded
    // Fortsätt till nästa middleware eller route
    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}
