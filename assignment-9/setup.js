const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

client.connect();

const query = `
CREATE TABLE sensor_data (
  x integer,
  y integer,
  z integer
);
`;

client.query(query, err => {
  if (err) throw err;
  client.end();
});
