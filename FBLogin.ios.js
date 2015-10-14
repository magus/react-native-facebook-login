var React = require('react-native');
var {
  StyleSheet,
  PropTypes,
  NativeModules,
  requireNativeComponent,

  // Once these are exposed, use them
  // LayoutPropTypes,
  // StyleSheetPropType,
  // NativeMethodsMixin,
  // RCTDeviceEventEmitter,
} = React;

// These are not yet exposed by the react-native package, so we must
// continue requiring them this way, which will cause warnings.
var LayoutPropTypes = require('LayoutPropTypes');
var StyleSheetPropType = require('StyleSheetPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

var { FBLoginManager } = NativeModules;

var FBLogin = React.createClass({
  statics: {
    Events: FBLoginManager.Events,
  },

  propTypes: {
    style: StyleSheetPropType(LayoutPropTypes),
    permissions: PropTypes.array, // default: ["public_profile", "email"]
    loginBehavior: PropTypes.number, // default: Native
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    onLoginFound: PropTypes.func,
    onLoginNotFound: PropTypes.func,
    onError: PropTypes.func,
    onCancel: PropTypes.func,
    onPermissionsMissing: PropTypes.func,
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
