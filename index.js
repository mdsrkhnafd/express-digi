import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;
// Parse JSON request bodies
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

// Create a new tea
app.post("/tea", (req, res) => {
  logger.info("A post request was made to /tea");
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

// Get all teas
app.get("/tea", (req, res) => {
  res.status(200).send(teaData);
});

// Get a specific tea
app.get("/tea/:id", (req, res) => {
  const teaId = parseInt(req.params.id);
  const tea = teaData.find((t) => t.id === teaId);
  if (tea) {
    return res.status(200).send(tea);
  } else {
    return res.status(404).send("Tea not found");
  }
});

// Update a specific tea
app.put("/tea/:id", (req, res) => {
  const teaId = parseInt(req.params.id);
  const { name, price } = req.body;
  const tea = teaData.find((t) => t.id === teaId);
  if (tea) {
    tea.name = name;
    tea.price = price;
    return res.status(200).send(tea);
  } else {
    return res.status(404).send("Tea not found");
  }
});

// Delete a specific tea
app.delete("/tea/:id", (req, res) => {
  const teaId = parseInt(req.params.id);
  const teaIndex = teaData.findIndex((t) => t.id === teaId);
  if (teaIndex !== -1) {
    teaData.splice(teaIndex, 1);
    return res.status(200).send("Tea deleted");
  } else {
    return res.status(404).send("Tea not found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server app listening on port ${port}...`);
});
