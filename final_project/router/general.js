const express = require('express');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;

    const book = books[isbn];

    if (book) {
        return res.send(JSON.stringify(book, null, 4));
    } else {
        return res.send(404).send({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    const author = req.params.author;
    let results = [];

    const keys = Object.keys(books);

    for (let i = 0; i < keys.length; i++) {
        let isbn = keys[i];
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            results.push({ isbn: isbn, ...books[isbn] });
        }
    }

    if (results.length > 0) {
        res.send(JSON.stringify(results, null, 4));
    } else {
        res.status(404).send({ message: "Author not found." });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const title = req.params.title;
    let results = [];

    const keys = Object.keys(books);

    for (let i = 0; i < keys.length; i++) {
        let isbn = keys[i];
        if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
            results.push({ isbn: isbn, ...books[isbn] });
        }
    }
    
    if (results.length > 0) {
        res.send(JSON.stringify(results, null, 4));
    } else {
        res.status(404).send({ message: "Title not found." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;

    const book = books[isbn];

    if (book) {
        return res.send(JSON.stringify(book.reviews, null, 4));
    } else {
        return res.status(404).send({ message: "Review not found." })
    }
});

module.exports.general = public_users;
