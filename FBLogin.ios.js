var React = require('react-native');
var {
  StyleSheet,
  PropTypes,
  NativeModules,
  requireNativeComponent
} = React;
var LayoutPropTypes = require('LayoutPropTypes');
var StyleSheetPropType = require('StyleSheetPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var StyleSheetPropType = require('StyleSheetPropType');

var { FBLoginManager } = NativeModules;

var FBLogin = React.createClass({
  statics: {
    Events: FBLoginManager.Events,
    LoginBehaviors: FBLoginManager.LoginBehaviors
    /* Exported values for LoginBehavior
     * Web: This is the default behavior, and indicates logging in through the native Facebook app may be used. The SDK may still use Safari instead.
     * Browser: Attempts log in through the Safari or SFSafariViewController, if available
     * Native: Attempts log in through the Facebook account currently signed in through the device Settings.
     * SystemAccount: Attempts log in through a modal UIWebView pop up
     */
  },

  propTypes: {
    style: StyleSheetPropType(LayoutPropTypes),
    permissions: PropTypes.array, // default: ["public_profile", "email"]
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    onLoginFound: PropTypes.func,
    onLoginNotFound: PropTypes.func,
    onError: PropTypes.func,
    onCancel: PropTypes.func,
    onPermissionsMissing: PropTypes.func,
    loginBehavior: React.PropTypes.number // default: Native
  },

  getInitialState: function(){
    return {
      credentials: null,
      subscriptions: [],
    };
  },

  mixins: [NativeMethodsMixin],

  componentWillMount: function(){
    var _this = this;
    var subscriptions = this.state.subscriptions;

    // For each event key in FBLoginManager constantsToExport
    // Create listener and call event handler from props
    // e.g.  this.props.onError, this.props.onLogin
    Object.keys(FBLoginManager.Events).forEach(function(event){
      subscriptions.push(RCTDeviceEventEmitter.addListener(
        FBLoginManager.Events[event],
        (eventData) => {
          // event handler defined? call it and pass along any event data
          var eventHandler = _this.props["on"+event];
          eventHandler && eventHandler(eventData);
        }
      ));
    })

    // Add listeners to state
    this.setState({ subscriptions : subscriptions });
  },

  componentWillUnmount: function(){
    var subscriptions = this.state.subscriptions;
    subscriptions.forEach(function(subscription){
      subscription.remove();
    });
  },

  componentDidMount: function(){
    var _this = this;
    FBLoginManager.getCredentials(function(error, data){
      if (!error) {
        _this.setState({ credentials : data.credentials });
      } else {
        _this.setState({ credentials : null });
      }
    });
  },

  render: function() {
    var props = {
      ...this.props,
      style: ([styles.base, this.props.style]),
    };

    return <RCTFBLogin {...props} />
  },
});

var RCTFBLogin = requireNativeComponent('RCTFBLogin', FBLogin);

var styles = StyleSheet.create({
  base: {
    width: 175,
    height: 30,
  },
});

module.exports = FBLogin;
