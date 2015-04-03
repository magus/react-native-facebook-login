var React = require('react-native');
var Parse = require('parse').Parse;

// Make react and parse global
window.React = React;
window.Parse = Parse;

Parse.initialize("R5k700UGVk8mlesGAS4hSuG3TY6qkFvaXEfh8pt7", "8XXUnoCELevIUO03rasXbrKugitx4wKb9PkrnQty");

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} = React;

var Login = require('./Login');

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
    backgroundColor: '#dcdee3',
  },
});

AppRegistry.registerComponent('AppEntry', () => AppEntry);

module.exports = AppEntry;
