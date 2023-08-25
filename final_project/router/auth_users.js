const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "Username or Password is missing." });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ token: accessToken });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbnId = req.params.isbn;
  const { review } = req.query;
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: "Review text is missing." });
  }

  if (!books[isbnId]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbnId].reviews) {
    books[isbnId].reviews = {};
  }

  if (!books[isbnId].reviews[username]) {
    books[isbnId].reviews[username] = {};
  }

  books[isbnId].reviews[username].review = review;
  return res
    .status(200)
    .json({ message: "Review added/modified successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnId = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbnId]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbnId].reviews) {
    return res.status(200).json({ message: "No reviews to delete." });
  }

  if (books[isbnId].reviews[username]) {
    delete books[isbnId].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(404).json({ message: "Review not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
