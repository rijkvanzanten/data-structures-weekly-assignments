const path = require("path");
const express = require("express");
const { postgraphile } = require("postgraphile");

require("dotenv").config();

module.exports = express()
  .use(postgraphile({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }, { graphiql: true }));
