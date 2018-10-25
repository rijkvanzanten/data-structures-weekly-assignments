/**
 * Convert a row element into the building info
 * @param  {HTMLElement} row The <tr> element to extract the data from
 * @return {String}          The building name
 */
module.exports = function getBuilding(row) {
  return (
    row.querySelector("h4") &&
    row.querySelector("h4").textContent
  ) || null;
}

