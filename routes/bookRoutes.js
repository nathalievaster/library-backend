const router = require("express").Router()
const Book = require("../models/Book")
const auth = require("../middleware/authMiddleware")

// GET all books
router.get("/", async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// GET single book
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id)
  res.json(book)
})

// CREATE book (protected)
router.post("/", auth, async (req, res) => {
  const newBook = new Book({
    ...req.body,
    user: req.user.id
  })

  const savedBook = await newBook.save()
  res.json(savedBook)
})

// UPDATE book (protected)
router.put("/:id", auth, async (req, res) => {
  const updated = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  res.json(updated)
})

// DELETE book (protected)
router.delete("/:id", auth, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id)
  res.json({ message: "Book deleted" })
})

module.exports = router
