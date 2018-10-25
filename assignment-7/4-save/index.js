const { Pool } = require("pg");
const zones = require("../zones.json");
const records = require("../data/parsed.json");

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

const meetingTypes = {
  b: "Beginners Meeting",
  bb: "Big Book Meeting",
  c: "Closed Discussion",
  o: "Open Meeting",
  od: "Open Discussion Meeting",
  s: "Step Meeting"
};

async function insert() {
  await Promise.all(
    zoneCodes.map(code =>
      pool.query(`INSERT INTO zones (id) VALUES ('${code}')`)
    )
  );

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
    parsedNeighborhoods.map(async ({ name, zone_id, zipcodes }) => {
      const { rows } = await pool.query(
        `INSERT INTO neighborhoods (name, zone_id) VALUES ($1::text, '${zone_id}') RETURNING id`,
        [name]
      );
      const neighborhood_id = rows[0].id;

      return await Promise.all(
        zipcodes.map(zipcode =>
          pool.query(
            `INSERT INTO zipcodes (zipcode, neighborhood_id) VALUES ('${zipcode}', ${neighborhood_id})`
          )
        )
      );
    })
  );

  await Promise.all(
    records.map(
      async ({ building, address, wheelchair, title, details, hours, zone }) => {
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

        const { rows: meetingRows } = await pool.query(`
          INSERT INTO meetings (title, details, location_id)
          VALUES ($1, $2, $3)
          RETURNING id;
        `, [title, details, addressID]
        );

        const meetingID = meetingRows[0].id;

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
