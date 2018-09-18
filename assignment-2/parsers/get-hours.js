const formatTitle = require("@directus/format-title");
const getDocument = require("../get-document");

module.exports = function getHours(row) {
  const td = row.querySelector("td:nth-of-type(2)");
  return td.innerHTML
    .split("<br>\n                      <br>")
    .map(html => html.trim())
    .filter(html => html)
    .map((html, i) => {
      const document = getDocument(html);

      const dayRegex = /([^\s]+)/;
      const dayMatch = document.querySelector("b").textContent.match(dayRegex);
      const day = dayMatch ? dayMatch[0].toLowerCase().slice(0, 3) : null;

      const hoursRegex = /[0-9]{1,2}:[0-9]{2}\s(PM|AM)/g;
      const hoursMatch = html.match(hoursRegex);
      const startTime = hoursMatch[0];
      const endTime = hoursMatch[1];

      const typeRegex = /(?<=Meeting Type )[A-Z]{1,2}/;
      const typeMatch = document.body.textContent.match(typeRegex);
      const type = typeMatch ? typeMatch[0].toLowerCase().trim() : null;

      const specialInterestRegex = /(?<=Special Interest )(.*)/;
      const specialInterestMatch = document.body.textContent.match(specialInterestRegex);
      const specialInterest = specialInterestMatch ? formatTitle(specialInterestMatch[0].toLowerCase().trim()) : null;

      return {
        day,
        startTime,
        endTime,
        type,
        specialInterest
      };
    });
}
