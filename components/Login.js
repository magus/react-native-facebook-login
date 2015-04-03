'use strict';

var {
  StyleSheet,
  Image,
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

var FB_PHOTO_WIDTH = 200;

var Login = React.createClass({
  getInitialState: function(){
    return {
      user: null,
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

    return (
      <View style={styles.loginContainer}>
        { user && <Photo user={user} /> }
        { user && <Info user={user} /> }

        <FBLoginButton style={{ marginBottom: 10, }}
          permissions={["email"]} />

        <Text>{ user ? user.token : "N/A" }</Text>
      </View>
    );
  }
});

var Photo = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      photo: null,
    };
  },

  componentWillMount: function(){
    var _this = this;
    var user = this.props.user;
    var api = `https://graph.facebook.com/v2.3/${user.userId}/picture?width=${FB_PHOTO_WIDTH}&redirect=false&access_token=${user.token}`;

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        _this.setState({
          photo : {
            url : responseData.data.url,
            height: responseData.data.height,
            width: responseData.data.width,
          },
        });
      })
      .done();
  },

  render: function(){
    var photo = this.state.photo;

    return (
      <View style={styles.bottomBump}>

        <Image
          style={photo &&
            {
              height: photo.height,
              width: photo.width,
            }
          }
          source={{uri: photo && photo.url}}
        />
      </View>
    );
  }
});

var Info = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      info: null,
    };
  },

  componentWillMount: function(){
    var _this = this;
    var user = this.props.user;
    var api = `https://graph.facebook.com/v2.3/${user.userId}?fields=name,email&access_token=${user.token}`;

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        _this.setState({
          info : {
            name : responseData.name,
            email: responseData.email,
          },
        });
      })
      .done();
  },

  render: function(){
    var info = this.state.info;

    return (
      <View style={styles.bottomBump}>
        <Text>{ info && this.props.user.userId }</Text>
        <Text>{ info && info.name }</Text>
        <Text>{ info && info.email }</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  loginContainer: {
    marginTop: 150,

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBump: {
    marginBottom: 15,
  },
});

module.exports = Login;
