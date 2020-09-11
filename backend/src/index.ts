import axios from "axios";
import bodyParser from "body-parser";
import { greenBright } from "chalk";
import express from "express";
import { appendFileSync, readFileSync } from "fs";
import morgan from "morgan";
import * as rice from "../../rice";

const { port, hooks } = JSON.parse(
  readFileSync("./config.json").toLocaleString()
);

const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());

const id = new Date(Date.now()).getTime();
const file = `data/${id}-data.txt`;

const classifier = new rice.FilteredClassifier(
  new rice.ExponentialFilter(0.7, 0),
  new rice.PowerLevelClassifier(0.2, 0.5)
);

const stateTracker = {
  state: undefined as rice.CookerState | undefined,
};

appendFileSync(file, "min, max, avg\n");

app.post("/hook/power", async (req, res) => {
  const { min, max, avg } = req.body;

  console.log(`${greenBright("data")} ${min} ${max} ${avg}`);
  appendFileSync(file, `${min}, ${max}, ${avg}\n`);

  const newState = classifier.classify(avg);

  if (newState !== stateTracker.state) {
    stateTracker.state = newState;
    const stateString = rice.prettifyState(newState);

    await Promise.all(
      (hooks as string[]).map((hookDomain) =>
        axios.post(hookDomain, {
          status: stateString,
        })
      )
    );
  }

  res.sendStatus(200);
});

app.listen(port, () => console.log(`Listening on ${port}`));
