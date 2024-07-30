const express = require("express");
const app = express();
let conn = require("./db.js");

app.use(express.json());

app.get("/todos", (req, res) => {
  conn.query("SELECT * FROM Todos", (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  conn.query("SELECT * FROM Todos WHERE id=?", [id], (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.post("/todos", (req, res) => {
  const { id, title, description } = req.body;
  conn.query(
    "INSERT INTO Todos (id, title, description) VALUES (?, ?, ?)",
    [id, title, description],
    (err) => {
      if (err) {
        console.log("Failed to create todo", err);
        res.status(500).json("Failed to create todo");
      } else {
        res.status(201).send("Todo created successfully");
      }
    }
  );
});

app.put("/todos/:id", (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  conn.query(
    "UPDATE Todos SET title=?, description=? WHERE id=?",
    [title, description, id],
    (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json("Todo updated successfully");
      }
    }
  );
});

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  if (!title && !description) {
    return res
      .status(400)
      .json({ error: "At least one of title or description is required" });
  }

  const fields = [];
  const values = [];

  if (title) {
    fields.push("title = ?");
    values.push(title);
  }

  if (description) {
    fields.push("description = ?");
    values.push(description);
  }

  values.push(id);

  const query = `UPDATE Todos SET ${fields.join(", ")} WHERE id=?`;

  conn.query(query, values, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json("Todo updated successfully");
  });
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM Todos WHERE id=?";
  conn.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json("Failed to delete todo");
    } else {
      res.status(200).json("Todo deleted successfully");
    }
  });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
