const formatTitle = require("@directus/format-title");

module.exports = function getTitle(row) {
  const titleEl = row.querySelector("td:first-of-type b");

  if (!titleEl) return null;

  /**
   * Titles always contain a dash (-) character. Even if there's nothing after it:
   *
   * TUESDAY BIG BOOK STUDY - Tuesday Big Book Study
   * ST. NICHOLAS - St. Nicholas
   * SALEM - Salem
   * CONVENT -
   *
   * The second part always seems to be the "human readable" version
   */
  const parts = titleEl.textContent
    .split(" - ")            // Create an array of the parts of the title
    .map(str => str.trim())  // Make sure there's no trailing spaces before / after each part
    .filter(str => str);     // An empty string is falsey. This reduces the array length to 1 if there's no second half.

  /**
   * If there's only 1 "half" (eg, the UPPERCASE part), return a title-formatted
   * version of that string
   */
  if (parts.length === 1) {
    return formatTitle(parts[0]);
  }

  // Else, return the existing "human readable" version of the title
  return parts[1];
}
