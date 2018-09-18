module.exports = function getAddress(row) {
  const td = row.querySelector("td:first-of-type");

  const tdTextLines = td.textContent.split("\n").map(str => str.trim());

  const line1 = tdTextLines[3].split(",")[0];

  const line2 = (
    tdTextLines[3].split(",")[1] &&
    tdTextLines[3].split(",")[1].trim()
  ) || null;

  const line3 = "";

  return {
    line1,
    line2,
    line3,
    city: "New York City",
    state: "NY",
    zip: null,
    other: null
  }
}
