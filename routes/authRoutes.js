const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/User")

// Registrera
router.post("/register", async (req, res) => {
  const { username, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    password: hashedPassword
  })

  await user.save()

  res.json({ message: "User created" })
})

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  //Hitta användaren i databasen
  const user = await User.findOne({ username })
  if (!user) return res.status(400).json({ message: "User not found" })

    // Jämför lösenordet
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(400).json({ message: "Wrong password" })

    // Skapa JWT-token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )

  res.json({ 
    token, 
    user: {
        id: user._id,
        username: user.username
    }
})
})

module.exports = router
