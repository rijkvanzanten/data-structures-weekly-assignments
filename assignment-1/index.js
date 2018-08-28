const { promisify } = require("util");
const fs = require("fs");
const path = require("path");

const chalk = require("chalk");
const axios = require("axios");

const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

const createURL = pageID => `https://parsons.nyc/aa/${pageID}.html`;
const createFilePath = pageID => path.join(__dirname, "data", `${pageID}.html`);

const pageIDs = [
  "rijk", "m01", "m02", "m03", "m04", "m05",
  "m06", "m07", "m08", "m09", "m10"
];

async function saveHTML(pageID) {
  const url = createURL(pageID);
  const res = await axios(url);
  const html = res.data;
  await writeFile(createFilePath(pageID), html);

  console.log(chalk`{green Success!} File {bold ${`${pageID}.html`}} saved! 🎉`);
}

function handleError(error, pageID) {
  console.log(chalk`{red Failed!} Something {red bad} happened while retrieving page {bold ${pageID}} 😣`);

  const date = new Date().toISOString().split("T")[0];
  appendFile(path.join(__dirname, "logs", `${date}.txt`), error)
    .catch(err => { throw err });
}

pageIDs.forEach(pageID => saveHTML(pageID).catch(err => handleError(err, pageID)));
