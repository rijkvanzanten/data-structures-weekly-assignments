const { Pool } = require("pg");
const zones = require("./zones.json");
const records = require("./input.json");

require("dotenv").config();

const { user, host, database, password, port } = process.env;

const pool = new Pool({ user, host, database, password, port });

pool.connect();

const zoneCodes = zones.map(({ code }) => code);

const parsedNeighborhoods = [];

zones.forEach(({ code, neighborhoods }) => {
  neighborhoods.forEach(({ name, zipcodes }) => {
    parsedNeighborhoods.push({
      name,
      zone_id: code,
      zipcodes
    });
  });
});

async function insert() {
  await Promise.all(zoneCodes.map(code => pool.query(`INSERT INTO zones (id) VALUES ('${code}')`)));
  
  await Promise.all(parsedNeighborhoods.map(async ({ name, zone_id, zipcodes }) => {
    const { rows } = await pool.query(`INSERT INTO neighborhoods (name, zone_id) VALUES ($1::text, '${zone_id}') RETURNING id`, [name]);
    const neighborhood_id = rows[0].id;

    return await Promise.all(zipcodes.map(zipcode => pool.query(`INSERT INTO zipcodes (zipcode, neighborhood_id) VALUES ('${zipcode}', ${neighborhood_id})`)));
  }));

  await Promise.all(records.map(({ address }) => {
    const { line1, line2, zip, city, state, coordinates } = address;
    return pool.query(`
      INSERT INTO locations (line1, line2, zip, city, state, latitude, longitude, zone_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT ON CONSTRAINT locations_line1_key 
      DO NOTHING;
    `, [line1, line2, zip, city, state, coordinates.lat, coordinates.lon, "08"]);
  }));

  pool.end();
  process.exit(0);
}

insert();
