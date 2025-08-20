const express = require('express');
const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

app.use(session({ secret: "fingerprint", resave: true, saveUninitialized: true }));

// Example public route
app.get('/', (req, res) => {
    res.send("Server is running");
});

let users = [];

const isValid = (username)=>{ 

return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in!" });
    }

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.session?.authorization?.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!username) {
        return res.status(401).json({ message: "User not logged in." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required in the request body" });
    }

    books[isbn].reviews = books[isbn].reviews || {};

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `Review for book ${books[isbn].title} by ${username} has been added/updated.` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }
    if (!username) {
        return res.status(401).json({ message: "User not logged in." });
    }
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(400).json({ message: "No review found for this user." });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: `Review for book ${books[isbn].title} by ${username} has been deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
