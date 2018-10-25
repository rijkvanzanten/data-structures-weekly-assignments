/**
 * Convert a row element into the address info
 * @param  {HTMLElement} row The <tr> element to extract the data from
 * @return {Object}          The (formatted) address info
 */
module.exports = function getAddress(row) {
  const td = row.querySelector("td:first-of-type");

  /**
   * Since the address info isn't structured in the HTML in any way,
   * we need to work with the actual text lines. I figured it's easier to reason
   * about and work with the info by having the lines separated in an array.
   */
  const tdTextLines = td.textContent.split("\n").map(str => str.trim());

  /**
   * The first part of the third text line contains the first address line
   * (<number> <street>)
   */
  const line1 = tdTextLines[3].split(",")[0];

  /**
   * The second address line (floor number, room, apartment, etc) is the part
   * after the comma (,) in the third line of text in the <tr>
   */
  const line2 = (
    tdTextLines[3].split(",")[1] &&
    tdTextLines[3].split(",")[1].trim()
  ) || null;

  /**
   * The only way to figure out the ZIP code is by looking for a sequence of 5
   * numbers.
   * I was hoping to be able to select the last 5 characters of the line, but
   * certain rows unfortunately have content or a trailing character after the
   * ZIP code
   */
  const zipRegex = /[0-9]{5}/; // 5 characters in the range 0-9
  const zipMatch = tdTextLines[4].match(zipRegex);
  const zip = zipMatch ? +zipMatch[0] : null;

  /**
   * I noticed that most rows contain extra information about the location
   * in parentheses. This information isn't a part of the "official" address type
   * but useful info to have nonetheless
   */
  const otherRegex = /(?<=\()(.*)(?=\))/; // Everything between ()
  const otherMatch = tdTextLines[4].match(otherRegex);
  const other = otherMatch ? otherMatch[0] : null;

  return {
    line1,
    line2,
    zip,
    other,
    /**
     * These two are cheating, I know 😄. But seeing all these pages are about
     * the AA in NYC, these are a given. Also, not every row contained the
     * state (fe NY) in the row, so to retrieve this accurately, we would've to
     * rely on the ZIP code and do some sort of lookup
     */
    city: "New York City",
    state: "NY"
  }
}
