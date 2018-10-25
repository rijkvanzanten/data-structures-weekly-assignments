const fs = require("fs");
const path = require("path");
const axios = require("axios");
const series = require("run-series");

require("dotenv").config();

const apiKey = process.env.TAMU_KEY;

const pageIDs = [
  "m01", "m02", "m03", "m04", "m05",
  "m06", "m07", "m08", "m09", "m10"
];

const meetings = pageIDs.reduce((result, pageID) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "json", `${pageID}.json`)));
  return [...result, ...json];
}, []);

function processMeeting(meeting, i) {
  return function (cb) {
    const { line1: streetAddress, zip, city, state } = meeting.address;

    axios
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
      })
      .then(res => res.data)
      .then(data => {
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

        console.log(`
          Meeting ${i} saved
          ${Latitude} / ${Longitude}

        `);
      })
      .catch(err => {
        console.log(`Meeting ${i} failed`);
      });

    setTimeout(() => cb(null), 2000);
  }
}

series(meetings.map(processMeeting), () => {
  fs.writeFile(
    path.join(__dirname, "..", "data", "parsed.json"),
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

 
