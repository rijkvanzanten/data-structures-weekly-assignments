/**
 * Convert a row element into the details info
 * @param  {HTMLElement} row The <tr> element to extract the data from
 * @return {String}          The details content
 */
module.exports = function getDetails(row) {
  // The only element that actually has a usable class, thanks!
  const detailsEl = row.querySelector(".detailsBox");
  return detailsEl ? detailsEl.textContent.trim() : null;
}
