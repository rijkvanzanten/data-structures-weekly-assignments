const { Client } = require("pg");

// Read the .env file and add it's values to the env variables
require("dotenv").config();

const { user, host, database, password, port } = process.env;

// Connect to the DB
const client = new Client({ user, host, database, password, port });
client.connect();

const queries = [
  "DROP TABLE IF EXISTS locations CASCADE",

  `CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NULL,
    line1 VARCHAR(150) NOT NULL UNIQUE,
    line2 VARCHAR(100) NULL,
    zip VARCHAR(10),
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    wheelchair_accessible BOOLEAN,
    zone_id CHAR(2) NOT NULL REFERENCES zones(id)
  )`,

  
  "DROP TABLE IF EXISTS meetings CASCADE",

  `CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    details VARCHAR(255) NULL,
    location_id INTEGER NOT NULL REFERENCES locations(id)
  )`,


  "DROP TABLE IF EXISTS meeting_hours CASCADE",

  `CREATE TABLE meeting_hours (
    id SERIAL PRIMARY KEY,
    day CHAR(3) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    special_interest VARCHAR(255) NULL,
    meeting_id INTEGER NOT NULL REFERENCES meetings(id),
    meeting_type_id VARCHAR(2) REFERENCES meeting_types(id)
  )`,


  "DROP TABLE IF EXISTS meeting_types CASCADE",

  `CREATE TABLE meeting_types (
    id VARCHAR(2) PRIMARY KEY,
    name VARCHAR(50) NOT NULL
  )`,


  "DROP TABLE IF EXISTS zones CASCADE",

  `CREATE TABLE zones (
    id CHAR(2) PRIMARY KEY
  )`,


  "DROP TABLE IF EXISTS neighborhoods CASCADE",

  `CREATE TABLE neighborhoods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    zone_id CHAR(2) NOT NULL REFERENCES zones(id)
  )`,


  "DROP TABLE IF EXISTS zipcodes CASCADE",

  `CREATE TABLE zipcodes (
    zipcode VARCHAR(10) PRIMARY KEY,
    neighborhood_id INTEGER NOT NULL REFERENCES neighborhoods(id)
  )`
];

// Wait for all the queries to be executed before closing the DB connection
Promise.all(queries.map(query => client.query(query)))
  .then(() => client.end())
  .then(() => console.log("Done installing!"))
  .catch(console.error);
