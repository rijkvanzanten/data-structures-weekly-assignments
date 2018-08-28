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

/**
 * `chalk` gives you an easy API to console.log colors to the Node terminal.
 * So pretty! ✨
 *
 * Docs: https://github.com/chalk/chalk/blob/master/readme.md
 */
const chalk = require("chalk");

/**
 * `axios` is a(nother) HTTP client. I prefer Axios over other popular options
 * like `request` because it works in both Node & the browser (only have to
 * learn it once) and it returns Promises instead of callbacks.
 *
 * Docs: https://github.com/axios/axios/blob/master/README.md
 */
const axios = require("axios");

/**
 * Promisify both used `fs` function so we can use them in combination with
 * async / await
 */
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

/**
 * Seeing that all URLs share the same "base URL", I figured I could save some
 * bytes by saving just the page IDs into an array. Using a small helper function
 * I'm able to generate the full URL based on the ID.
 */
const pageIDs = [
  "m01", "m02", "m03", "m04", "m05",
  "m06", "m07", "m08", "m09", "m10"
];

/**
 * The previously mentioned helper URL that transform a page ID into the full URL
 * @param  {String} pageID The page's ID (eg m02)
 * @return {String}        The page's full URL
 */
const getURL = pageID => `https://parsons.nyc/aa/${pageID}.html`;

/**
 * Generate a (local) file path based on the page ID. Very similar to the getURL function
 * @param  {String} pageID The page's ID (eg m02)
 * @return {String}        The page's (local) full filepath
 */
const getFilePath = pageID => path.join(__dirname, "data", `${pageID}.txt`);

/**
 * Get a page's HTML content and save the content to a file
 * @param  {String} pageID The page's ID (eg m02)
 * @return {Promise}       Resolves void, rejects with either an `fs` or `axios` error
 */
async function saveHTML(pageID) {
  const url = getURL(pageID);

  // Fetch the page
  const res = await axios(url);
  const html = res.data;

  // Write the page content's to file
  await writeFile(getFilePath(pageID), html);

  // Log a happy message
  console.log(chalk`{green Success!} File {bold ${`${pageID}.txt`}} saved! 🎉`);
}

/**
 * If anything bad happens during either the HTML retrieval or saving, log a
 * warning to the console and save the full error to the logs folder
 * @param  {Error}  error   The error that occured
 * @param  {String} pageID  The page's ID (eg m02)
 */
function handleError(error, pageID) {
  console.log(chalk`{red Failed!} Something {red bad} happened while retrieving page {bold ${pageID}} 😣`);

  // Get the current date in YYYY-MM-DD format
  const date = new Date().toISOString().split("T")[0];

  // Append (or create) the error to a file named YYYY-MM-DD.txt (based on the
  // previous variable)
  appendFile(path.join(__dirname, "logs", `${date}.txt`), `\n\n[${pageID}.html]: ${error}`)
    .catch(err => { throw err });
}

/**
 * Loop over all the saved page IDs. For each of those IDs, run the saveHTML
 * function. If it happens to fail, handle the error gracefully.
 */
pageIDs.forEach(pageID => saveHTML(pageID).catch(err => handleError(err, pageID)));
