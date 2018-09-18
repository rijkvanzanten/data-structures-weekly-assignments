const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const getTitle = require("./parsers/get-title");
const getDetails = require("./parsers/get-details");
const getBuilding = require("./parsers/get-building");
const getWheelchair = require("./parsers/get-wheelchair");
const getAddress = require("./parsers/get-address");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function getDocument(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  return document;
}

function processRow(row, i) {
  const info = {
    title: getTitle(row),
    details: getDetails(row),
    building: getBuilding(row),
    wheelchair: getWheelchair(row),
    address: getAddress(row)
  };

  return info;
}

async function process(inputPath, outputPath) {
  const html = await readFile(inputPath);
  const document = getDocument(html);

  const rows = document.querySelectorAll('tr[style="margin-bottom:10px"]');

  const data = Array.from(rows).map(processRow);

  console.log(data);

  // await writeFile(outputPath, JSON.stringify(data, null, 4));
}

const inputPath = path.join(__dirname, "input.html");
const outputPath = path.join(__dirname, "output.json");

process(inputPath, outputPath).catch(console.error);
