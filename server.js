//define needed assets
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

//makes pg workk burr
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();

//makes assets work burr
app.use(express.json());
//makes it read it correectly burr
app.use(express.urlencoded({ extended: true }));

//unchanged burr
app.use(express.static("public"));

//promise fs versh
const readFromFile = util.promisify(fs.readFile);

//writing to specified location
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

//grab and appendd content to html
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

//make pg go burr with static html route
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//route note
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//grabbing all notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)));
});

//post routing
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/notes.json");
    res.json(`Note Added`);
  } else {
    res.error("Error while adding");
  }
});

//BONUS :D
//find correct id to delete
app.delete("/api/notes:id", (req, res) => {
  console.info(`${req.method} request received`);
  readFromFile("./db/notes.json").then((data) => JSON.parse(data));

  const id = req.params.id;
  const newId = 0;

  for (var i = 0; i < data.length; i++) {
    if (data[i].id === req.params.id) {
      data.splice(i);
    } else {
      res.error("Error while deleting");
    }
  }
});

//connect to localhost
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
