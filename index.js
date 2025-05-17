import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";


const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "school",
  password: "08167327933",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// 🔁 Get books from database with optional sorting
async function getBooks(sort) {
    let orderBy = "id ASC";
    if (sort === "title") orderBy = "title ASC";
    else if (sort === "rating") orderBy = "rating DESC";
  
    const result = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);
    return result.rows;
  }
 
  app.get("/", async (req, res) => {
    const sort = req.query.sort; // ?sort=title or ?sort=rating
    const books = await getBooks(sort);
    res.render("index", { books });
  });
  
  // 📚 Optional: fetch book details from Open Library API
  // Example function – not in use yet
  async function fetchBookDetails(isbn) {
    try {
      const response = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for ISBN ${isbn}:`, error.message);
      return null;
    }
  }



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });