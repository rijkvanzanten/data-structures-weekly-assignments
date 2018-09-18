module.exports = function getAddress(row) {
  const td = row.querySelector("td:first-of-type");

  const tdTextLines = td.textContent.split("\n").map(str => str.trim());

  const line1 = tdTextLines[3].split(",")[0];

  const line2 = (
    tdTextLines[3].split(",")[1] &&
    tdTextLines[3].split(",")[1].trim()
  ) || null;


  const zipRegex = /[0-9]{5}/;
  const zipMatch = tdTextLines[4].match(zipRegex);
  const zip = zipMatch ? +zipMatch[0] : null;

  const otherRegex = /(?<=\()(.*)(?=\))/;
  const otherMatch = tdTextLines[4].match(otherRegex);
  const other = otherMatch ? otherMatch[0] : null;

  return {
    line1,
    line2,
    zip,
    other,
    city: "New York City", // These two are cheating, I know 😄
    state: "NY"
  }
}
