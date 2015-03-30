'use strict';

var {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight,
  PixelRatio,
} = React;

var RottenTomatoeRatings = require('./ratings/RottenTomatoeRatings');


var MovieCell = React.createClass({
  propTypes: {
    movie: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired,
  },

  render: function() {
    var movie = this.props.movie;
    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onPress}
        >
          <View style={styles.container}>
            <Image
              style={styles.thumbnail}
              source={{uri: movie.posters.thumbnail}}
            />
            <View style={styles.rightContainer}>
              <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
              <Text style={styles.year} numberOfLines={1}>{movie.year}</Text>
              <RottenTomatoeRatings
                critics={movie.ratings.critics_score}
                audience={movie.ratings.audience_score}
              />
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.cellBorder} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    padding: 5,
    backgroundColor: '#fafafa',
  },
  rightContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 53,
    height: 81,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    color: '#121b2e',
  },
  year: {
    color: '#9197a3',
    fontSize: 12,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 5,
  },
});

module.exports = MovieCell;
