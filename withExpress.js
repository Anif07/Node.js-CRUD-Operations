let express = require("express");
var fs = require("fs");
var port = 8080;
const app = express();

var register = [];

app.use(express.json());

app.get("/", (req, res) => {
  fs.readFile("Register.json", (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(JSON.parse(data));
  });
});

app.post("/", (req, res) => {
  register.push(req.body);
  fs.writeFile("Register.json", JSON.stringify(register), (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  res.send("posted successfully");
});

app.listen(port, () => {
  console.log(`listening in ${port}`);
});
