// By using a pool instead of single connection, the PG library will automatically
// handle the amount of connections needed to efficiently run all the queries.
// This means that I can query quite sloppy in the code here (don't bother about
// waiting) and the library will handle queuing and keeping the connection(s) alive
const { Pool } = require("pg");

// My custom zones data file
const zones = require("./zones.json");

// The result of last weeks assignment
const records = require("./input.json");

// The zone where the records are all in
const zone = "08";

// Read the .env file and add it's values to the env variables
require("dotenv").config();

const { user, host, database, password, port } = process.env;

// Connect to the DB
const pool = new Pool({ user, host, database, password, port });
pool.connect();

// Get all the zones (01, 02) etc. This could've been a hardcoded array, but 
// in real life there are most likely more zones than just the 10 in Manhattan
const zoneCodes = zones.map(({ code }) => code);

// I had to make sure that the object structure created in last assignment was
// flattened to an extent so I could more easily insert it into the DB later
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

// Could've been a separate JSON file, but seeing the size of all types, this'll
// do
const meetingTypes = {
  b: "Beginners Meeting",
  bb: "Big Book Meeting",
  c: "Closed Discussion",
  o: "Open Meeting",
  od: "Open Discussion Meeting",
  s: "Step Meeting"
};

// The main insert function. Again using async/await to handle async code a little
// more gracefully. It doesn't do any sort of graceful error handling. If one insert
// fails, the DB connection is closed and the script will log the error and exit
// the process
async function insert() {

  // 1. Insert all the zones (01, 02, etc)
  await Promise.all(
    zoneCodes.map(code =>
      pool.query(`INSERT INTO zones (id) VALUES ('${code}')`)
    )
  );

  // 2. Add the meeting types
  await Promise.all(
    Object.keys(meetingTypes).map(type => 
      pool.query(`
        INSERT INTO meeting_types (id, name)
        VALUES ($1, $2)
        ON CONFLICT ON CONSTRAINT meeting_types_pkey 
        DO NOTHING;
      `,[type, meetingTypes[type]]
      )
    )
  );

  await Promise.all(
    // 3. Add the neighborhoods
    parsedNeighborhoods.map(async ({ name, zone_id, zipcodes }) => {
      const { rows } = await pool.query(
        `INSERT INTO neighborhoods (name, zone_id) VALUES ($1::text, '${zone_id}') RETURNING id`,
        [name]
      );
      const neighborhood_id = rows[0].id;

      // 4. Add the zipcodes
      return await Promise.all(
        zipcodes.map(zipcode =>
          pool.query(
            `INSERT INTO zipcodes (zipcode, neighborhood_id) VALUES ('${zipcode}', ${neighborhood_id})`
          )
        )
      );
    })
  );

  // 5. Add the locations
  await Promise.all(
    records.map(
      async ({ building, address, wheelchair, title, details, hours }) => {
        const { line1, line2, zip, city, state, coordinates } = address;

        const { rows: addressRows } = await pool.query(`
          INSERT INTO locations (name, line1, line2, zip, city, state, latitude, longitude, wheelchair_accessible, zone_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT ON CONSTRAINT locations_line1_key 
          DO UPDATE SET line1 = $2
          RETURNING id;
        `, [
            building,
            line1,
            line2,
            zip,
            city,
            state,
            coordinates.lat,
            coordinates.lon,
            wheelchair,
            zone
          ]
        );

        const addressID = addressRows[0].id;

        // 7. Add the meetings
        const { rows: meetingRows } = await pool.query(`
          INSERT INTO meetings (title, details, location_id)
          VALUES ($1, $2, $3)
          RETURNING id;
        `, [title, details, addressID]
        );

        const meetingID = meetingRows[0].id;

        // 8. Add the meeting hours
        await Promise.all(
          hours.map(
            async ({
              day,
              startTime,
              endTime,
              type,
              specialInterest
            }) => pool.query(`
              INSERT INTO meeting_hours (day, start_time, end_time, special_interest, meeting_id, meeting_type_id)
              VALUES ($1, $2, $3, $4, $5, $6)
            `, [day, startTime, endTime, specialInterest, meetingID, type])
          )
        );
      }
    )
  );

  pool.end();
  process.exit(0);
}

insert().catch(err => {
  pool.end();
  console.error(err);
});
