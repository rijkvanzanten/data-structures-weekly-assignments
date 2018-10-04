const { Client } = require("pg");
const records = require("./input.json");

require("dotenv").config();

const { user, host, database, password, port } = process.env;

const client = new Client({ user, host, database, password, port });

client.connect();

Promise.all(queries.map(query => client.query(query)))
  .then(() => client.end())
  .then(() => console.log("Done!"))
  .catch(console.error);
