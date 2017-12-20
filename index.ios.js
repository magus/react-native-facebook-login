import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  NativeMethodsMixin,
  TouchableHighlight,
  DeviceEventEmitter
} from 'react-native';

import itypeof from 'itypeof';

const FBLoginManager = NativeModules.MFBLoginManager;

const styles = StyleSheet.create({
  login: {
    flex: 0,
    backgroundColor: '#3B5998',
    padding: 10,
    alignItems: 'center'
  },
  whiteFont: {
    color: 'white'
  }
});

const statics = {
  loginText: 'Login with Facebook',
  logoutText: 'Logout from Facebook'
};

class FBLogin extends Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this._handleEvent = this._handleEvent.bind(this);
    this._getButtonView = this._getButtonView.bind(this);
    this.getChildContext = this.getChildContext.bind(this);
    this._onFacebookPress = this._onFacebookPress.bind(this);

    this.statics = {
      Events: FBLoginManager.Events,
    };

    this.state = {
      statics: statics,
      isLoggedIn: false,
      buttonText: statics.loginText,
      credentials: null,
      subscriptions: [],
    };
  }

  componentWillMount() {
    const subscriptions = this.state.subscriptions;

    // For each event key in FBLoginManager constantsToExport
    // Create listener and call event handler from props
    // e.g.  this.props.onError, this.props.onLogin
    Object.keys(FBLoginManager.Events).forEach((event) => {
      subscriptions.push(DeviceEventEmitter.addListener(
        FBLoginManager.Events[event],
        (eventData) => {
          // event handler defined? call it and pass along any event data
          let eventHandler = this.props["on" + event];
          let data = eventData.credentials ? eventData.credentials : eventData;
          eventHandler && eventHandler(data);
        }
      ));
    });
    // Add listeners to state
    this.setState({
      subscriptions: subscriptions
    });
  }

  componentWillUnmount() {
    const subscriptions = this.state.subscriptions;
    subscriptions.forEach(subscription => subscription.remove());
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    FBLoginManager.getCredentials((error, data) => {
      if (!this.mounted) return;
      if (!error) {
        this.setState({
          isLoggedIn: true,
          buttonText: this.state.statics.logoutText,
          credentials: data.credentials
        });
      } else {
        this.setState({
          isLoggedIn: false,
          buttonText: this.state.statics.loginText,
          credentials: null
        });
      }
    });
  }

  static childContextTypes = {
    isLoggedIn: PropTypes.bool,
    login: PropTypes.func,
    logout: PropTypes.func,
    props: PropTypes.shape({})
  }

  getChildContext() {
    return {
      isLoggedIn: this.state.isLoggedIn,
      login: this.login,
      logout: this.logout,
      props: this.props
    };

  }

  login(permissions) {
    FBLoginManager.loginWithPermissions(
      permissions || this.props.permissions,
      (err, data) => this._handleEvent(err, data)
    );
  }

  logout() {
    FBLoginManager.logout((err, data) => this._handleEvent(err, data));
  }

  _handleEvent(e, data) {
    const result = e || data;
    if (result.credentials) {
      this.setState({
        isLoggedIn: true,
        buttonText: this.state.statics.logoutText
      });
    } else {
      this.setState({
        isLoggedIn: false,
        buttonText: this.state.statics.loginText
      });
    }

    if (result.credentials) {
      if (this.state.credentials) {
        this.props['onLogin'](result.credentials);
      }
    } else {
      console.log('Event is not defined or recognized', result);
    }
  }

  _onFacebookPress() {
    let permissions = [];
    if (itypeof(this.props.permissions) === 'array') {
      permissions = this.props.permissions;
    }

    if (this.state.isLoggedIn) {
      this.logout()
    } else {
      this.login(permissions)
    }
  }

    _getButtonView() {
        const buttonText = this.props.facebookText ? this.props.facebookText : this.state.buttonText;
        return (this.props.buttonView)
            ? this.props.buttonView
            : (
                <View style={[styles.login, this.props.style]}>
                    <Text style={[styles.whiteFont, this.fontStyle]}> {buttonText} </Text>
                </View>
            );
    }

    render() {
        return (
            <TouchableHighlight onPress={this._onFacebookPress} underlayColor={this.props.onClickColor} >
                <View style={[this.props.containerStyle]}>
                    {this._getButtonView()}
                </View>
            </TouchableHighlight>
        )
    }
}

module.exports = {
  FBLogin,
  FBLoginManager
};
