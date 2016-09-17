import React, {
  PropTypes,
  Component
}from 'react';

import {
  View,
  StyleSheet,
  NativeModules,
  NativeMethodsMixin,
  DeviceEventEmitter,
  requireNativeComponent
} from 'react-native';

const FBLoginManager = NativeModules.MFBLoginManager;
const RCTMFBLogin = requireNativeComponent('RCTMFBLogin', FBLogin);

const  styles = StyleSheet.create({
  base: {
    width: 175,
    height: 30,
  },
});


class FBLogin extends Component {
  constructor (props) {
    super(props);

    this.bindAll = this.bindAll.bind(this);
    this.bindAll();

    this.statics = {
      Events : FBLoginManager.Events,
    };

    this.state = {
      credentials   : null,
      subscriptions : [],
    }
  }

  bindAll() {
    for( const prop in NativeMethodsMixin) {
      if( typeof NativeMethodsMixin[ prop ] === 'function') {
        this[prop] = NativeMethodsMixin[prop].bind(this);
      }
    }
  }

  componentWillMount(){
    const subscriptions = this.state.subscriptions;

    // For each event key in FBLoginManager constantsToExport
    // Create listener and call event handler from props
    // e.g.  this.props.onError, this.props.onLogin
    Object.keys(FBLoginManager.Events).forEach((event) => {
      subscriptions.push(DeviceEventEmitter.addListener(
        FBLoginManager.Events[event],
        (eventData) => {
          // event handler defined? call it and pass along any event data
          let eventHandler = this.props["on"+event];
          eventHandler && eventHandler(eventData);
        }
      ));
    });
    // Add listeners to state
    this.setState({ subscriptions : subscriptions });
  }

  componentWillUnmount(){
    const subscriptions = this.state.subscriptions;
    subscriptions.forEach(subscription => subscription.remove());
  }

  componentDidMount(){
    FBLoginManager.getCredentials((error, data) => {
      if (!error) {
        this.setState({ credentials : data.credentials });
      } else {
        this.setState({ credentials : null });
      }
    });
  }

  render() {
    return <RCTMFBLogin {...this.props} style={[styles.base, this.props.style]} />
  }
}

FBLogin.propTypes = {
  style: View.propTypes.style,
  permissions: PropTypes.array, // default: ["public_profile", "email"]
  loginBehavior: PropTypes.number, // default: Native
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onLoginFound: PropTypes.func,
  onLoginNotFound: PropTypes.func,
  onError: PropTypes.func,
  onCancel: PropTypes.func,
  onPermissionsMissing: PropTypes.func,
};

module.exports = {
  FBLogin,
  FBLoginManager
};
