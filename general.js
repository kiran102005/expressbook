const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Task 1: Get all books
// Route to get all books
public_users.get("/", (req, res) => {
    return res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  const book = books[isbn];

 if (book) {
    return res.status(200).json(book);
} else {
    return res.status(404).json({ message: "Book not found" });
}
});
// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];

    // Iterate through books and match the author
    for (let key in books) {
        if (books[key].author === author) {
            matchingBooks.push(books[key]);
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});
// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  // Iterate through books and match the title
  for (let key in books) {
      if (books[key].title === title) {
          matchingBooks.push(books[key]);
      }
  }

  if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
  } else {
      return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
      return res.status(200).json(book.reviews);
  } else {
      return res.status(404).json({ message: "No reviews found for this book" });
  }
});
// Task 10: Get the list of books using Async/Await
public_users.get('/', async (req, res) => {
    try {
        const response = await new Promise((resolve) => {
            resolve(books); // Simulate a Promise
        });
        res.status(200).send(JSON.stringify(response, null, 2));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books." });
    }
});
// Task 11: Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found.");
            }
        });
        res.status(200).send(JSON.stringify(response, null, 2));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});
// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const bookList = Object.values(books).filter(book => book.author === author);
        if (bookList.length > 0) {
            resolve(bookList);
        } else {
            reject("No books found for this author.");
        }
    })
    .then(bookList => res.status(200).send(JSON.stringify(bookList, null, 2)))
    .catch(error => res.status(404).json({ message: error }));
});

// Task 13: Get book details based on Title using Async/Await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await new Promise((resolve, reject) => {
            const bookList = Object.values(books).filter(book => book.title === title);
            if (bookList.length > 0) {
                resolve(bookList);
            } else {
                reject("No books found for this title.");
            }
        });
        res.status(200).send(JSON.stringify(response, null, 2));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});


module.exports.general = public_users;
