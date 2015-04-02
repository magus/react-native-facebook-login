'use strict';

var {
  StyleSheet,
  Text,
  View,
  AlertIOS,
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

  getToken: function(){
    var _this = this;
    FacebookLogin.detect(function(error, credentials){
      if (!error) {
        _this.setState({ user : credentials });
      }
    });
  },

  componentWillMount: function(){
    this.getToken();
  },

  render: function() {
    var user = this.state.user;
    var creds = user
      ? <View>
          <Text>{ user.userId }</Text>
          <Text>{ user.token }</Text>
        </View>
      : <Text>N/A</Text>;

    return (
      <View style={styles.loginContainer}>
        <FBLoginButton />

        { creds }
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
