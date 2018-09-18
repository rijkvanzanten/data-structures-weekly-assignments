module.exports = function getBuilding(row) {
  return (
    row.querySelector("h4") &&
    row.querySelector("h4").textContent
  ) || null;
}

