const express = require('express');
const  router = express.Router();

const Book= require('../models/book.model');

//MIDDLEWARE

const getBook = async(req, res, next) =>{
  let book;
  const {id} = req.params;

  if(!id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(404).json({message: 'El ID del libro no es válido.'})
  }

  try{
    book = await Book.findById(id); // Busca una coincidencia entre el id y el _id Del objeto

    if(!book){
      return res.status(404).json({message: 'El libro no fue encontrado.'})
    }

  } catch(error){
    return res.status(500).json({message: error.message})
  }

  res.book = book;
  next()

}

//Obtener todos los libros [GET ALL]

router.get('/', async(req, res) =>{
  try{
    const books = await Book.find(); // Devuelve todos los libros de la DB
    if(books.length === 0){
      return res.status(204).json([])
    }

    res.json(books)

  }catch(error){
    res.status(500).json({message: error.message})
  }
} )

// Crear un nuevo libro (recurso) [POST]

router.post('/', async (req, res) =>{

  const {title, author, gener, publication_date} = req?.body 
  if(!title || !author || !gener || !publication_date){
    return res.status(400).json({message: 'Los campos title, author, gener, publication_date son obligatorios.'})
  }

  const book = new Book(
    {
      title, 
      author,
      gener,
      publication_date
    }
  )

  try{
    const newBook = await book.save(); // Guarda el book del POST en Mongo, y luego se almacena en newBook.
    console.log(newBook);
    res.status(201).json(newBook);

  }catch(error){
    res.status(400).json({message: error.message});
  }

})

router.get('/:id', getBook, async(req, res) =>{
  res.json(res.book);
})

router.put('/:id', getBook, async(req, res) =>{
  try {
    const book = res.book
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.gener = req.body.gener || book.gener;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save()
    res.json(updatedBook)

  } catch (error) {
    res.status(400).json({message:error.message})
  }
})

router.patch('/:id', getBook, async(req, res) =>{

if(!req.body.title && !req.body.author && !req.body.gener && !req.body.publication_date){
  res.status(400).json({message: 'Al menos debe ser enviado uno de estos campos: title, author, gener, publication_date.'})
}

  try {
    const book = res.book
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.gener = req.body.gener || book.gener;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save()
    res.json(updatedBook)

  } catch (error) {
    res.status(400).json({message:error.message})
  }
})

router.delete('/:id', getBook, async(req, res) =>{
  try {
    const book = res.book;
    await book.deleteOne({ // Elimina el libro que contenga dicho _id
                                          // El _id lo provee automáticamente MongoDB.
      _id: book._id
    });
    res.json({message:`El libro ${book.title} fue eliminado exitosamente!`})


  } catch (error) {
    res.status(500).json({message:error.message})
  }
})


module.exports = router