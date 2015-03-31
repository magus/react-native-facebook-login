'use strict';

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
} = React;

var FacebookLogin = require('NativeModules').FacebookLogin;

var FBLogin = React.createClass({
  propTypes: {
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onSuccess: React.PropTypes.func,
  },

  getInitialState: function(){
    return {
      credentials: "",
    };
  },

  setCredentials: function(credentials){
    this.setState({ credentials : credentials });
    this.props.onSuccess(credentials);
  },

  handleFacebookLogin: function(){
    var _this = this;
    FacebookLogin.detect(function(error, credentials){
      if (!error) {
        console.log("existing login found: ", credentials);
        _this.setCredentials(credentials);
      } else {
        console.log("no existing login found, executing login flow");
        FacebookLogin.login(function(error, credentials){
          if (error) {
            console.log("error encountered during fb login: ", error);
          } else {
            console.log("login success: ", credentials);
            _this.setCredentials(credentials);
          }
        });
      }
    });
  },

  onPress: function(){
    this.handleFacebookLogin();
    this.props.onPress && this.props.onPress();
  },

  componentWillMount: function(){
    var _this = this;
    FacebookLogin.detect(function(error, credentials){
      if (!error) {
        console.log("existing login found: ", credentials);
        _this.setState({ credentials : credentials });
      } else {
        console.log("no existing login found: ", error);
      }
    });
  },

  render: function() {
    var text = this.state.credentials || "Log in with Facebook";
    return (
      <View style={this.props.style}>
        <TouchableHighlight
          style={styles.container}
          onPress={this.onPress}
        >
          <View style={styles.FBLoginButton}>
            <Image style={styles.FBLogo} source={require('image!FB-f-Logo__white_144')} />
            <Text style={styles.FBLoginButtonText} numberOfLines={1}>{text}</Text>
          </View>
        </TouchableHighlight>
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
  },
  FBLoginButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 5,
    marginHorizontal: 80,
    height: 35,

    backgroundColor: '#4c69ba',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#354c8c',

    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  FBLoginButtonText: {
    color: 'white',
    fontWeight: '900',
    fontFamily: 'Helvetica neue',

    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  FBLogo: {
    height: 25,
    width: 25,
    marginRight: 8,
  },
});

module.exports = FBLogin;
