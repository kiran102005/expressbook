
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.session?.token; // Ensure session exists
    if (!token) return res.status(403).json({ message: "Access Denied. Token not provided." });

    jwt.verify(token, "fingerprint_customer", (err, user) => {
        if (err) return res.status(401).json({ message: "Invalid Token" });
        req.user = user;
        next();
    });
}

// Task 7: User Login Route
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required." });
    }

    // Validate user credentials
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Generate JWT token for valid user
        const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
        req.session.token = token; // Save token in session
        return res.status(200).json({ message: "Login successful!", token });
    } else {
        return res.status(401).json({ message: "Invalid Username or Password" });
    }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is required." });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Add or update review
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review; // Update the user's review

    return res.status(200).json({ message: "Review added/updated successfully.", reviews: books[isbn].reviews });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if reviews exist
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found to delete." });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully.", reviews: books[isbn].reviews });
});

// Export the router and required properties
module.exports.authenticated = regd_users;
module.exports.users = users;
