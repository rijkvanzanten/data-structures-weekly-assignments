const { JSDOM } = require("jsdom");

module.exports = function getDocument(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  return document;
}
