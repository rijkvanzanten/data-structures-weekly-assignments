module.exports = function getWheelchair(row) {
  // This particular styling of <span> is only used for the wheelchair accessible badge
  const wheelchairEl = row.querySelector('span[style="color:darkblue; font-size:10pt;"');

  return !!wheelchairEl;
}
