const express = require("express");
var app = express();
let db = require("./db/db.json");
let uuid = require("uuid");
const fs = require("fs");
var path = require("path");


var PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});


app.get("/api/notes", function (req, res) {
  console.log("/api/notes-get");
  res.json(db);
});


app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});


app.post("/api/notes", function (req, res) {
  let note = req.body;
  note.id = uuid.v1();
  db.push(note);
  writeToDB(db);
  return res.json(db);
});



app.delete("/api/notes/:id", function (req, res) {
  let id = req.params.id;
  for (let i = 0; i < db.length; i++) {
    if (db[i].id == id) {
      db.splice(i, 1);
      writeToDB(db);
      res.json(db);
      break;
    }
  }
});

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});



function writeToDB(array) {
  fs.writeFileSync("./db/db.json", JSON.stringify(array));
}
