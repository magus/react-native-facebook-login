var React = require('react');
var ReactNative = require('react-native');

// Make react global
window.React = React;

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} = ReactNative;

var Login = require('./components/Login');
var LoginMock = require('./components/LoginMock');

var AppEntry = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        itemWrapperStyle={styles.allPages}
        initialRoute={{
          title: 'Login',
          component: Login,
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
