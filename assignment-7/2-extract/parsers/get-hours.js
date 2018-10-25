/**
 * format-title is a little package I wrote that will convert any "ugly" string
 * to a Title Case equivalent.
 * See https://www.npmjs.com/package/@directus/format-title
 */
const formatTitle = require("@directus/format-title");

const htmlMin = require("html-minifier").minify;

const getDocument = require("../get-document");

/**
 * Convert a row element into the hours info
 * @param  {HTMLElement} row The <tr> element to extract the data from
 * @return {Array}           Array of all the meeting days and hours
 */
module.exports = function getHours(row) {
  const td = row.querySelector("td:nth-of-type(2)");

  return htmlMin(td.innerHTML, { collapseWhitespace: true })
    .split("<br><br>")
    .map(html => html.trim())

    /**
     * Since an empty string ("") has a falsey value, this will filter out all
     * the empty items
     */
    .filter(html => html)
    .map((html, i) => {
      const document = getDocument(html);

      const dayRegex = /([^\s]+)/; // Every character until the first space
      const dayMatch = document.querySelector("b").textContent.match(dayRegex);
      const day = dayMatch ? dayMatch[0].toLowerCase().slice(0, 3) : null;

      const hoursRegex = /[0-9]{1,2}:[0-9]{2}\s(PM|AM)/g; // 9:14 AM, 10:54 PM, etc
      const hoursMatch = html.match(hoursRegex);
      const startTime = hoursMatch[0];
      const endTime = hoursMatch[1];

      /**
       * Seeing the actual meeting details are only separated by <br>s 😑, the
       * easiest (and I think only?) way of retrieving the meeting type code is
       * by selecting the 1 or 2 characters after the literal text "Meeting Type "
       */
      const typeRegex = /(?<=Meeting Type )[A-Z]{1,2}/; // 2 chars after Meeting Type
      const typeMatch = document.body.textContent.match(typeRegex);
      const type = typeMatch ? typeMatch[0].toLowerCase().trim() : null;

      /**
       * Same goes for special interest. Luckily, special interest always seems
       * to come last, so I'm able to select everything after it
       */
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
