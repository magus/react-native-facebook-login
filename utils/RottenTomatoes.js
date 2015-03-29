var PUBLIC = {};

PUBLIC.getStyleFromScore = function(score){
  var colorMax = 200;
  var relativeScore = Math.round(colorMax * (score/100));
  return {
    color: `rgb(
      ${colorMax - relativeScore},
      ${relativeScore},
      0
    )`,
  };
};

module.exports = PUBLIC;
