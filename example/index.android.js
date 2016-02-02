var React = require('react-native');

// Make react global
window.React = React;

var {
  AppRegistry,
  Navigator,
  StyleSheet,
} = React;

var Login = require('./components/Login');
var LoginMock = require('./components/LoginMock');

var AppEntry = React.createClass({
  render: function() {
    return (
      <Navigator
        style={styles.container}
        itemWrapperStyle={styles.allPages}
        initialRoute={{
          title: 'Login',
          component: Login,
        }}
        renderScene={(route, navigator) => {
          var Component = route.component;
          return <Component />
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allPages: {
    backgroundColor: '#EEE',
  },
});

AppRegistry.registerComponent('example', () => AppEntry);

module.exports = AppEntry;
