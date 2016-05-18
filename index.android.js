var React = require('react');
var ReactNative = require('react-native');

var {
  NativeModules,
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} = ReactNative;

var FBLoginManager = NativeModules.FBLoginManager;

var services = require('./lib/services');

var FBLogin = React.createClass({
  childContextTypes: {
    isLoggedIn: React.PropTypes.bool,
    login: React.PropTypes.func,
    logout: React.PropTypes.func,
    props: React.PropTypes.object
  },
  getChildContext: function () {
    return {
      isLoggedIn: this.state.isLoggedIn,
      login: this.login,
      logout: this.logout,
      props: this.props
    };
  },
  getInitialState() {
   var statics = {
     loginText: 'Login with Facebook',
     logoutText: 'Logout from Facebook'
   };
  return {
    statics:statics,
    isLoggedIn: false,
    buttonText: statics.loginText
  };
},
logout() {
    FBLoginManager.logout((err, data) => this._handleEvent(err, data));
},
login(permissions) {
  FBLoginManager.loginWithPermissions(
    permissions || this.props.permissions,
    (err,data) => this._handleEvent(err,data)
  );
},
componentDidMount: function(){
  var self = this;
  FBLoginManager.setLoginBehavior(self.props.loginBehavior);
  FBLoginManager.getCredentials(function(data){
    if(data &&
        services.itypeof(data.credentials) === 'object' &&
        services.itypeof(data.credentials.token) === 'string' &&
        data.credentials.token.length > 0){
      self.setState({isLoggedIn:true, buttonText: self.state.statics.logoutText});
    }else{
      self.setState({isLoggedIn:false, buttonText: self.state.statics.loginText});
    }
    self._handleEvent(null,data);
  })
},
  _handleEvent(e, data) {

    var result = e || data;
    if(result.type === 'success' && result.profile){
      try{
        result.profile = JSON.parse(result.profile)
      }catch(err){
        console.warn('Could not parse facebook profile: ', result.profile);
        console.error(err);
      }
    }

    if(result.eventName === 'onLogin' || result.eventName === 'onLoginFound'){
      this.setState({isLoggedIn:true, buttonText: this.state.statics.logoutText});
    }else if(result.eventName === 'onLogout'){
      this.setState({isLoggedIn:false, buttonText: this.state.statics.loginText});
    }

    if(result.eventName && this.props.hasOwnProperty(result.eventName)){
      var event = result.eventName;
      delete result.eventName;
      console.log('Triggering \'%s\' event', event)
      this.props[event](result);
    }else{
      console.log('\'%s\' Event is not defined or recognized', result.eventName)
    }
  },

  _onFacebookPress() {
    var permissions = [];
    if( services.itypeof(this.props.permissions) === 'array'){
      permissions = this.props.permissions;
    }

    if(this.state.isLoggedIn){
      this.logout()
    }else{
      this.login(permissions)
    }
   },

  render: function(){
    var FBLoginButtonView = <View style={[styles.login, this.props.style]}>
      <Text style={[styles.whiteFont, this.fontStyle]}> {this.state.buttonText} </Text>
    </View>;
    if(this.props.buttonView){
      FBLoginButtonView = this.props.buttonView
    }

    return (
      <TouchableHighlight onPress={this._onFacebookPress} >
        <View style={[this.props.containerStyle]}>
          {FBLoginButtonView}
        </View>
      </TouchableHighlight>
    )
  }
});

var styles = StyleSheet.create({
    login: {
        flex: 1,
        backgroundColor: '#3B5998',
        padding: 10,
        alignItems: 'center'
    },
    whiteFont: {
        color: 'white'
    }
});

module.exports = FBLogin;
