const express = require("express");
app = express();
let conn = require("./db.js");

app.use(express.json());

app.get("/books", (req, res) => {
  conn.query("select * from Books", (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  conn.query("select * from Books where id=?", [id], (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.post("/books", (req, res) => {
  console.log(req.body);
  const { id, title, author } = req.body;
  conn.query("insert into Books values (?,?,?)", [id, title, author], (err) => {
    if (err) {
      console.log("failed", err);
    } else {
      res.send("posted successfully");
    }
  });
});
app.put("/books/:id", (req, res) => {
  const { title, author } = req.body;
  const id = req.params.id;
  conn.query(
    `update Books set title='${title}', author='${author}' where id=${id}`,
    (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json("Updated successfully");
      }
    }
  );
});
app.patch("/books/:id", (req, res) => {
  const id = req.params.id;
  const { title, author } = req.body;

  if (!title && !author) {
    return res
      .status(400)
      .json({ error: "At least one of title or author is required" });
  }

  const fields = [];
  const values = [];

  if (title) {
    fields.push("title = ?");
    values.push(title);
  }

  if (author) {
    fields.push("author = ?");
    values.push(author);
  }

  values.push(id);

  const query = `update Books set ${fields.join(", ")} where id=?`;

  conn.query(query, values, (err) => {
    if (err) {
      return res.status(200).json(err);
    }
    res.json("Book updated successfully");
  });
});
app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  const query = "delete from Books where id=?";
  conn.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting book:", err);
      res.status(500).json("not able to delte");
    } else {
      res.status(200).json("Deleted successfully");
    }
  });
});
app.listen(8080, () => {
  console.log("server is listening in 8080 port");
});
