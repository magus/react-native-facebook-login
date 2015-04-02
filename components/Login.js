'use strict';

var {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} = React;

var FBLogin = require('./facebook/FBLogin');
var FBLoginButton = require('./iOS/FBLoginButton.ios.js')
var FacebookLogin = require('NativeModules').FacebookLogin;

var Login = React.createClass({
  getInitialState: function(){
    return {
      user: {},
    };
  },

  render: function() {
    return (
      <View style={styles.loginContainer}>
        <FBLoginButton />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  loginContainer: {
    marginTop: 375,

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

module.exports = Login;
