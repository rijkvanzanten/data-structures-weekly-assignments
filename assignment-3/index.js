const fs = require("fs");
const path = require("path");

const axios = require("axios");

require("dotenv").config();

const apiKey = process.env.TAMU_KEY;

// const data = require("./demo-api-result");

const meetings = require(path.join(__dirname, "input.json"));

const requests = meetings.map(async (meeting, i) => {
  const { line1: streetAddress, zip, city, state } = meeting.address;

  const { data } = await axios
    .get("http://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsedDetailed_V04_01.aspx", {
      params: {
        streetAddress,
        city,
        state,
        zip,
        apiKey,
        format: "json",
        censusYear: "2010",
        version: "4.01"
      }
    });

  const { Latitude, Longitude } = (
    data &&
    data.OutputGeocodes &&
    data.OutputGeocodes &&
    data.OutputGeocodes[0] &&
    data.OutputGeocodes[0].OutputGeocode
  ) || {};

  meeting.address.coordinates = {
    lat: Latitude || null,
    lon: Longitude || null
  };

  meetings[i] = meeting;
});

Promise.all(requests)
  .then(() => {
    fs.writeFile(
      path.join(__dirname, "output.json"),
      JSON.stringify(meetings, null, 4),
      err => {
        if (err) {
          console.log("❌ There was an error while writing the file");
          return;
        }

        console.log("🎉 All done!");
      }
    );
  })
  .catch(() => {
    console.log("❌ A request failed..");
  });
