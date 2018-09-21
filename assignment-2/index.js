/**
 * util.promisify takes a "regular" callback-based function and returns a version
 * that returns promises.
 *
 * Using this, you're able to use native Node (callback based) functions in
 * combination with async/await
 */
const { promisify } = require("util");

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

const getDocument = require("./get-document");

/**
 * These are all the functions that extract the various parts of information
 * out of the <tr> elements. See each individual file for more information on
 * how they work.
 */
const getTitle = require("./parsers/get-title");
const getDetails = require("./parsers/get-details");
const getBuilding = require("./parsers/get-building");
const getWheelchair = require("./parsers/get-wheelchair");
const getAddress = require("./parsers/get-address");
const getHours = require("./parsers/get-hours");

/**
 * Wrap the fs.readFile and fs.writeFile to make them Promise based
 */
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * Convert a row element to an AA event object
 * @param  {HTMLElement} row The <tr> element containing the info
 * @return {Object}          The formatted information in an object
 */
function processRow(rowElement) {
  const info = {
    title: getTitle(rowElement),
    details: getDetails(rowElement),
    building: getBuilding(rowElement),
    wheelchair: getWheelchair(rowElement),
    address: getAddress(rowElement),
    hours: getHours(rowElement)
  };

  return info;
}

/**
 * Process an AA HTML file into a structured JSON file
 * @param  {String} inputPath  Path of the HTML file to read
 * @param  {String} outputPath Where to save the JSON file
 */
async function processFile(inputPath, outputPath) {
  const html = await readFile(inputPath);
  const document = getDocument(html);

  /**
   * By using the attribute selector, we're able to select just the <tr> elements
   * that contain the useful information
   */
  const rows = document.querySelectorAll('tr[style="margin-bottom:10px"]');

  /**
   * The rows variable above is of NodeList type, which doesn't have the
   * .map() method included. By using the spread operator, we can convert the
   * NodeList to an array, which allows us to use the array methods
   */
  const data = [...rows].map(processRow);

  /**
   * By a number as the third parameter for JSON.stringify, we can "pretty print"
   * the JSON. It's not required and pretty useless for the program (as it
   * doesn't change the way the next assignment will read it), but it makes it
   * look nice and more readable for humans.
   */
  await writeFile(outputPath, JSON.stringify(data, null, 2));

  console.log("✨ All done!");
}

let inputPath = path.join(__dirname, "input.html");
let outputPath = path.join(__dirname, "output.json");

/**
 * This allows the user to override the input file by running the program
 * with an input file:
 * node index.js input.html
 */
if (process.argv.length > 2) {
  inputPath = path.join(__dirname, process.argv[2]);
}

/**
 * This allows the user to also override the output location file by running the program
 * with two arguments:
 * node index.js input.html output.json
 */
if (process.argv.length > 3) {
  outputPath = path.join(__dirname, process.argv[3]);
}

/**
 * Since `process` is an async function, it technically returns a Promise.
 * Therefore, we can catch all the errors that might occur inside of the function
 * into a single error handler. Nice!
 */
processFile(inputPath, outputPath).catch(err => console.error(`❌ Oh no... \n\n${err}`));
