'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight,
} = React;

var MovieList = React.createClass({
  propTypes: {
    movie: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired,
  },

  render: function() {
    var movie = this.props.movie;
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={styles.container}
      >
        <View style={styles.container}>
          <Image
            style={styles.thumbnail}
            source={{uri: movie.posters.thumbnail}}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.year}>{movie.year}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('MovieList', () => MovieList);

module.exports = MovieList;
