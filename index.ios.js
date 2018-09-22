import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  ViewPropTypes,
  StyleSheet,
  NativeModules,
  NativeMethodsMixin,
  DeviceEventEmitter,
  requireNativeComponent,
  TouchableHighlight
} from 'react-native';

import itypeof from 'itypeof'

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


    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this._handleEvent = this._handleEvent.bind(this);
    this._getButtonView = this._getButtonView.bind(this);
    this.getChildContext = this.getChildContext.bind(this);
	this._onFacebookPress = this._onFacebookPress.bind(this);
	
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
    this.mounted = false;
  }

  componentDidMount(){
    this.mounted = true;
    FBLoginManager.getCredentials((error, data) => {
      if( !this.mounted ) return;
      if (!error) {
        this.setState({ credentials : data.credentials });
      } else {
        this.setState({ credentials : null });
      }
    });
  }

  //render() {
  //  return <RCTMFBLogin {...this.props} style={[styles.base, this.props.style]} />
  //}

  render() {
	  return (<TouchableHighlight onPress={this._onFacebookPress} underlayColor={this.props.onClickColor} >
        <View style={[this.props.containerStyle]}>
          {this._getButtonView()}
        </View>
      </TouchableHighlight>)
  }


  //custom

  _getButtonView () {
    const buttonText = this.props.facebookText ? this.props.facebookText:this.state.buttonText;
    return (this.props.buttonView)
      ? this.props.buttonView
      : (
        <View style={[styles.login, this.props.style]}>
          <Text style={[styles.whiteFont, this.fontStyle]}> {buttonText} </Text>
        </View>
      );
  }

  login(permissions) {
    FBLoginManager.loginWithPermissions(
      permissions || this.props.permissions,
      (err,data) => this._handleEvent(err,data)
    );
  }

  getChildContext () {
    return {
      isLoggedIn: this.state.isLoggedIn,
      login: this.login,
      logout: this.logout,
      props: this.props
    };

  }

  logout() {
    FBLoginManager.logout((err, data) => this._handleEvent(err, data));
  }

  _handleEvent(e, data) {
    const result = e || data;
    if(result.type === 'success' && result.profile){
      try{
        result.profile = JSON.parse(result.profile)
      } catch (err) {
        console.warn('Could not parse facebook profile: ', result.profile);
        console.error(err);
      }
    }

    if(result.eventName === 'onLogin' || result.eventName === 'onLoginFound'){
      this.setState({isLoggedIn:true, buttonText: this.state.statics.logoutText});
    } else if (result.eventName === 'onLogout'){
      this.setState({isLoggedIn:false, buttonText: this.state.statics.loginText});
    }

    if(result.eventName && this.props.hasOwnProperty(result.eventName)){
      const event = result.eventName;
      delete result.eventName;
      console.log('Triggering \'%s\' event', event)
      this.props[event](result);
    } else {
      console.log('\'%s\' Event is not defined or recognized', result.eventName)
    }
  }

  _onFacebookPress() {
    let permissions = [];
    if( itypeof(this.props.permissions) === 'array'){
      permissions = this.props.permissions;
    }

    if(this.state.isLoggedIn){
      this.logout()
    }else{
      this.login(permissions)
    }
  }
}


const viewPropTypes = ViewPropTypes || View.propTypes;

FBLogin.propTypes = {
  style: viewPropTypes.style,
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
