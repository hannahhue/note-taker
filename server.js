//define needed assets
const express = require("express");
const path = require("path");
const fs = require("fs");

//makes pg workk burr
const PORT = 3001;
const app = express();

//makes assets work burr
app.use(express.json());
//makes it read it correectly burr
app.use(express.urlencoded({ extended: true }));

//unchanged burr
app.use(express.static("public"));

//make pg go burr with static html route
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//route note
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/pages/notes.html"))
);
