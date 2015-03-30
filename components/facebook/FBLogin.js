'use strict';

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
} = React;

var merge = require('mergeFast');
var FacebookLogin = require('NativeModules').FacebookLogin;

var FBLogin = React.createClass({
  propTypes: {
    style: React.PropTypes.dict,
    onPress: React.PropTypes.func,
  },

  getInitialState: function(){
    return {
      credentials: "",
    };
  },

  handleFacebookLogin: function(){
    FacebookLogin.login(function(error, credentials){
      if (error) {
        console.log("error encountered during fb login: ", error);
      } else {
        console.log(credentials);
        this.setState({ credentials : credentials });
      }
    });
  },

  onPress: function(){
    this.handleFacebookLogin();
    this.props.onPress();
  },

  render: function() {
    var text = this.state.credentials || "Login with Facebook";
    return (
      <TouchableHighlight
        style={styles.container}
        onPress={this.onPress}
      >
        <View style={styles.FBLoginButton}>
          <Image style={styles.FBLogo} source={require('image!FB-f-Logo__white_144')} />
          <Text style={styles.FBLoginButtonText} numberOfLines={1}>{text}</Text>
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
  },
  FBLoginButton: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#627aad',
  },
  FBLoginButtonText: {
    color: 'white',
    backgroundColor: '#627aad',
  },
  FBLogo: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
});

module.exports = FBLogin;
