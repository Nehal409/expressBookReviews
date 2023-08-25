const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username or password are not provided" });
    }
    if (isValid(username) == false) {
      users.push({ username, password });
      return res.status(201).json("User registered successfully.");
    } else {
      return res.status(400).json("username already registered");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("something went wrong.");
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  return res.status(200).json({ message: books });
});

// Get the book list available in the shop using async await and axios
public_users.get("/books", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000");
    console.log(response);
    const bookList = response.data.message;
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list." });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnId = req.params.isbn;
  const book = books[isbnId];
  if (book) {
    return res.status(200).json({ result: books[isbnId] });
  }
  return res.status(404).json(" No Book with this ISBN number!");
});

// Get book details based on ISBN using async await and axios
public_users.get("/isbn/:isbn/books", async function (req, res) {
  try {
    const isbnId = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbnId}`);
    const book = response.data;
    if (book) {
      return res.status(200).json({ book });
    }
    return res.status(404).json("No Book with this ISBN number!");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch book details" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const stringAuthor = String(author);
  const getAuthor = Object.values(books).find(
    (ele) => ele.author === stringAuthor
  );

  if (getAuthor) {
    return res.status(200).json({ result: getAuthor });
  }
  return res.status(404).json("No book with this author");
});

// Get book details based on author using async await and axios
public_users.get("/author/:author/books", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    const book = response.data.result;
    if (book) {
      return res.status(200).json({ book });
    }
    return res.status(404).json("No Book with this author!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch book details" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const stringtitle = String(title);
  const getBookWithTitle = Object.values(books).find(
    (ele) => ele.title === stringtitle
  );

  if (getBookWithTitle) {
    return res.status(200).json({ result: getBookWithTitle });
  }
  return res.status(404).json("No book with this title!");
});

// Get all books based on title using async await and axios
public_users.get("/title/:title/books", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    const book = response.data.result;
    if (book) {
      return res.status(200).json({ book });
    }
    return res.status(404).json("No Book with this title!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch book details" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const rev = books[isbn];

  if (!rev) {
    return res.status(404).json("No book with this isbn number.");
  }
  const reviews = rev.reviews;
  if (reviews) {
    return res.status(200).json({ result: reviews });
  }

  return res.status(404).json("No reviews available");
});

module.exports.general = public_users;
