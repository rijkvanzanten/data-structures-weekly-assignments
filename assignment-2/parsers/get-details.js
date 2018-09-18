module.exports = function getDetails(row) {
  const detailsEl = row.querySelector(".detailsBox");
  return detailsEl ? detailsEl.textContent.trim() : null;
}
