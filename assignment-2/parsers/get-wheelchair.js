/**
 * Convert a row element into the weelchair info
 * @param  {HTMLElement} row The <tr> element to extract the data from
 * @return {Boolean}         Whether or not the event is wheelchair accessible
 */
module.exports = function getWheelchair(row) {
  // This particular styling of <span> is only used for the wheelchair accessible badge
  const wheelchairEl = row.querySelector('span[style="color:darkblue; font-size:10pt;"');

  // Convert and ensure a boolean type
  return !!wheelchairEl;
}
