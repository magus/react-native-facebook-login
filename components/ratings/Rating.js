'use strict';

var {
  Text,
} = React;

var Rating = React.createClass({
  propTypes: {
    score: React.PropTypes.number,
  },

  isValidScore: function(){
    var score = this.props.score;
    return score && score > 0;
  },

  getStyle: function(){
    var score = this.props.score;

    // Return with noScore if falsy
    if (!this.isValidScore()) {
      return {
        color: '#999999',
      };
    }

    // Otherwise, relative rating colors
    var colorMax = 200;
    var relativeScore = Math.round(colorMax * (score/100));
    return {
      color: `rgb(
        ${colorMax - relativeScore},
        ${relativeScore},
        0
      )`,
    };
  },

  render: function() {
    var score = this.props.score;
    var text = this.isValidScore() ? `${score}%` : 'N/A';
    return (
      <Text style={this.getStyle()} numberOfLines={1}>{text}</Text>
    );
  }
});

module.exports = Rating;
