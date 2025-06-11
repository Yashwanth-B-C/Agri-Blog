const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const session = require("express-session");
const axios = require("axios");
const app = express();
const PORT = 3000;
require("dotenv").config();

// Paths
const POSTS_FILE = path.join(__dirname, "data", "posts.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");
const PRODUCTS_FILE = path.join(__dirname, "data", "products.json");
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(express.static("public"));
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "agri_secret_key",
  resave: false,
  saveUninitialized: true
}));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function loadProducts() {
  return loadJSON(PRODUCTS_FILE);
}

// Routes

app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const users = loadJSON(USERS_FILE);
  if (users.find(u => u.username === username)) return res.send("User already exists!");

  users.push({ username, password });
  saveJSON(USERS_FILE, users);
  req.session.username = username;
  res.redirect("/index.html");
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadJSON(USERS_FILE);
  if (!users.find(u => u.username === username && u.password === password)) {
    return res.send("Invalid credentials!");
  }

  req.session.username = username;
  res.redirect("/index.html");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// Fetch posts
app.get("/posts", (req, res) => {
  const posts = loadJSON(POSTS_FILE);
  res.json(posts);
});

// Fetch posts by current user
app.get("/my-posts", (req, res) => {
  const username = req.session.username;
  const posts = loadJSON(POSTS_FILE);
  const userPosts = posts.filter(post => post.author === username);
  res.json(userPosts);
});

app.post("/create-post", upload.single("image"), (req, res) => {
  const { title, content } = req.body;
  const username = req.session.username;
  const posts = loadJSON(POSTS_FILE);

  const imagePath = req.file
    ? `/uploads/${req.file.filename}`
    : "https://source.unsplash.com/featured/?agriculture";

  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    image: imagePath,
    author: username,
    date: new Date().toISOString().split("T")[0]
  };

  posts.push(newPost);
  saveJSON(POSTS_FILE, posts);

  res.sendStatus(200);
});

app.put("/edit-post/:id", upload.single("image"), (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const posts = loadJSON(POSTS_FILE);
  const index = posts.findIndex(post => post.id === postId);

  if (index === -1) return res.status(404).send("Post not found");

  posts[index].title = title;
  posts[index].content = content;

  if (req.file) {
    posts[index].image = `/uploads/${req.file.filename}`;
  }

  saveJSON(POSTS_FILE, posts);
  res.sendStatus(200);
});

app.get("/chatbot", (req, res) => {
  res.sendFile(path.join(__dirname, "chatbot.html"));
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}` 
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

// Load products
app.get("/products", (req, res) => {
  const products = loadProducts();
  res.json(products);
});

// Add to cart
app.post("/cart", (req, res) => {
  let { productId } = req.body;
  const products = loadProducts();

  if (!isNaN(productId)) {
    productId = parseInt(productId);
  }

  const product = products.find(p => p.id === productId);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(product);
  res.json({ message: `${product.name} added to cart` });
});

app.get("/cart", (req, res) => {
  res.json(req.session.cart || []);
});

app.delete("/cart/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (!req.session.cart || isNaN(index) || index < 0 || index >= req.session.cart.length) {
    return res.status(400).json({ message: "Invalid item" });
  }

  req.session.cart.splice(index, 1);
  res.json({ message: "Item removed" });
});

// Add product route
app.post("/add-product", upload.single("image"), (req, res) => {
  const { name, price } = req.body;
  const products = loadProducts();

  const newProduct = {
    id: Date.now().toString(),
    name,
    price,
    image: req.file
      ? `/uploads/${req.file.filename}`
      : "https://source.unsplash.com/featured/?farm,product"
  };

  products.push(newProduct);
  saveJSON(PRODUCTS_FILE, products);

  res.redirect("/shop.html?added=true");
});

app.post("/order", (req, res) => {
  req.session.cart = [];
  res.json({ message: "Thanks for ordering!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
