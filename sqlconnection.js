let express = require("express");
let app = express();
let conn = require("./db.js");

var query = "INSERT INTO node.persons (FirstName, LastName) VALUES (?, ?)";

app.use(express.json());

app.post("/register", (req, res) => {
  const { FirstName, LastName } = req.body;
  console.log(req.body);
  conn.query(query, [FirstName, LastName], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json("Error occurred");
    }
    res.status(200).json("Posted successfully");
  });
});

app.get("/users", (req, res) => {
  conn.query("SELECT * FROM node.persons;", (err, data) => {
    if (err) {
      return res.status(500).json("error while getting");
    } else {
      res.status(200).json(data);
    }
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
