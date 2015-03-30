var React = require('react-native');
var Parse = require('parse').Parse;

// Make react and parse global
window.React = React;
window.Parse = Parse;

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} = React;

var MovieList = require('./MovieList');

var MoviesApp = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Movies',
          component: MovieList,
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('MoviesApp', () => MoviesApp);

module.exports = MoviesApp;
