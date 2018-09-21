const { JSDOM } = require("jsdom");

/**
 * Convert a HTML string into a JSDom DOM object
 * @param  {String} html HTML string to convert
 * @return {Object}      JSDom DOM object
 */
module.exports = function getDocument(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  return document;
}
