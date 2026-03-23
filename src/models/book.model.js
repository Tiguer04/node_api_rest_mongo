const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    gener: String,
    publication_date: String
  }
)

module.exports = mongoose.model('Book', bookSchema);
