'use strict';

var {
  StyleSheet,
  Text,
  View,
} = React;

var Rating = require('./Rating');

var RottenTomatoeRatings = React.createClass({
  propTypes: {
    critics: React.PropTypes.number,
    audience: React.PropTypes.number,
  },

  render: function() {
    return (
      <View style={styles.flexRow}>
        <Rating score={this.props.critics} />
        <Text style={styles.ratingSpacer}>{" - "}</Text>
        <Rating score={this.props.audience} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  ratingSpacer: {
    marginRight: 5,
  },
});

module.exports = RottenTomatoeRatings;
