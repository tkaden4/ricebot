import bodyParser from "body-parser";
import { greenBright } from "chalk";
import express from "express";
import { appendFileSync, mkdirSync } from "fs";
import morgan from "morgan";

const PORT = 8080;
const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());

const id = new Date(Date.now()).getTime();
const file = `data/${id}-data.txt`;

appendFileSync(file, "min, max, avg\n");

app.post("/hook/power", (req, res) => {
  const { min, max, avg } = req.body;

  console.log(`${greenBright("data")} ${min} ${max} ${avg}`);
  appendFileSync(file, `${min}, ${max}, ${avg}\n`);

  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
