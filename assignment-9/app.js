const axios = require("axios");
const { Client } = require("pg");

require("dotenv").config();

const FIVE_MINUTES_IN_MS = 300000;

const deviceID = process.env.PHOTON_ID;
const particleVariable = "output";
const accessToken = process.env.PHOTO_TOKEN;

const particleUrl = `https://api.particle.io/v1/devices/${deviceID}/${particleVariable}?access_token=${accessToken}`;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function getAndWriteData() {
  const { data } = await axios(particleUrl);

  const { x, y, z } = JSON.parse(data.result);

  client.connect();

  const query = `INSERT INTO sensor_data (x, y, z) VALUES (${x}, ${y}, ${z});`;

  await client.query(query);

  client.end();
}

setInterval(getAndWriteData, FIVE_MINUTES_IN_MS);
