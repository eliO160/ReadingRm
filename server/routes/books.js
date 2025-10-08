import express from "express";
const router = express.Router();

import { 
  searchBooks,
  getBookById,
  getBookHtml
} from '../controllers/booksController.js';

router.get('/html/:id', getBookHtml); // GET example: .../api/books/html/11
router.get('/:id', getBookById); // GET example: .../api/books/12
router.get('/', searchBooks); // GET example: .../api/books?search=frankenstein

export default router;