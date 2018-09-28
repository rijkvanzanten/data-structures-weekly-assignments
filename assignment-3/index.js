/**
 * Node's native `fs` module allows you to do all kinds of manipulations involving
 * the filesystem. In this application, it's used to write and append to files.
 */
const fs = require("fs");

/**
 * `path` provides utils for working with file and directory paths. It's used
 * to make sure that a correct path is used in writing and appending to files
 */
const path = require("path");

/**
 * `axios` is another request package. I prefer axios over request because it
 * works both in the browser and Node, meaning that I only have to learn it's
 * api once. It also supports Promises out of the box, which allows me to prevent
 * callback hell.
 */
const axios = require("axios");

/**
 * `dotenv` will read the `.env` file and load it's contents into the Node
 * process event variables. I think it's a little easier to reason about having
 * a file with keys (that isn't in Git!) than having to remind to export a 
 * variable on the CLI before you run the script.
 *
 * Exporting a variable on the CLI will still work though!
 */
require("dotenv").config();

const apiKey = process.env.TAMU_KEY;

const meetings = require(path.join(__dirname, "input.json"));

/**
 * By mapping over the meetings, a new array is created containing the result
 * of the callback function. Because I'm using the `async` keyword, a Promise 
 * is returned which allows me to use the `requests` array in Promise.all 
 * directly.
 */
const requests = meetings.map(async (meeting, i) => {
  // With the : character, you can assign the value into another constant name
  const { line1: streetAddress, zip, city, state } = meeting.address;

  /**
   * To save some of the 2500 request limit, I used a locally stored copy of the
   * JSON structure to work with instead of an actual request response
   */
  // const data = require("./demo-api-result");

  /**
   * Axios' api is so nice to use.
   * No more "+= '&param=' + value + '&anotherParam=' + value2" madness
   */
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

  /**
   * This boils down to saying "if data exists and data.outputgeocodes exists" etc
   * etc. By falling back to an empty object, the two constants will be undefined
   * if it wasn't returned in the api.
   */
  const { Latitude, Longitude } = (
    data &&
    data.OutputGeocodes &&
    data.OutputGeocodes &&
    data.OutputGeocodes[0] &&
    data.OutputGeocodes[0].OutputGeocode
  ) || {};

  /**
   * If latitue / longitue doesn't exist (it's undefined) save null
   */
  meeting.address.coordinates = {
    lat: Latitude || null,
    lon: Longitude || null
  };

  // I'm overwriting each meeting object with the "enhanced" one
  meetings[i] = meeting;
});

// Wait for all the requests to be done
Promise.all(requests)
  .then(() => { // When they're all done

    /** 
     * I didn't bother promisifying the writeFile method this time, seeing the 
     * only thing we do in this promise .then is actually writing the file, we
     * don't run into any sort of callback confusion
     */
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
  .catch(() => { // When one fails
    console.log("❌ A request failed..");
  });
