'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight,
  PixelRatio,
} = React;

var MovieList = React.createClass({
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
    backgroundColor: '#F5FCFF',

    alignItems: 'center',
    padding: 5,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 5,
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  year: {
    color: '#999999',
    fontSize: 12,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
});

AppRegistry.registerComponent('MovieList', () => MovieList);

module.exports = MovieList;
