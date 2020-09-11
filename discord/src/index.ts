import bodyParser from "body-parser";
import { createLogger } from "bunyan";
import discord, { TextChannel } from "discord.js";
import express from "express";
import { readFileSync } from "fs";
import * as rice from "../../rice";

const app = express();
app.use(bodyParser.json());

const { token, channel_id, port } = JSON.parse(
  readFileSync("./config.json").toLocaleString()
);

const listenPort = +port;

const logger = createLogger({
  name: "ricebot",
});

const client = new discord.Client();

client.on("ready", async () => {
  logger.info("RiceBot started.");
});

app.post("/hook/status-change", async (req, res) => {
  logger.info("status update");
  try {
    const status = rice.parseState(req.body.status);
    const statusChannel = client.channels.cache.find(
      (cacheChannel) => cacheChannel.id === channel_id
    ) as TextChannel;

    logger.info(`status is now ${rice.prettifyState(status)}`);

    await statusChannel.send(
      `Rice cooker is now ${rice.prettifyState(status).toLowerCase()}`
    );

    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({
      error: "Invalid status " + req.body.status,
    });
  }
});

client
  .login(token)
  .then(() => {
    app.listen(listenPort, () =>
      logger.info(`Listening on port ${listenPort}`)
    );
  })
  .catch((e) => {
    logger.error(e);
  });
