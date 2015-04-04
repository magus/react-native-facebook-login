# react-native-facebook-login

![preview](preview.gif)

## todo
- Polish, package and publish

## setup
- ```open toy.xcodeproj```
- ⌘+R

## usage

### FBLogin
Wraps the native `FBSDKLoginButton` and provides hooks to various Facebook login events.
```js
var FBLogin = require('./iOS/FBLogin.ios.js');

var Login = React.createClass({
  render: function() {
    return (
      <FBLogin style={{ marginBottom: 10, }}
        permissions={["email","user_friends"]}
        onLogin={function(){
          console.log("Logged in!");
        }}
        onLogout={function(){
          console.log("Logged out.");
        }}
        onError={function(){
          console.log("ERROR");
        }}
        onCancel={function(){
          console.log("User cancelled.");
        }}
        onPermissionsMissing={function(){
          console.log("Check permissions!");
        }}
        onLoginNotFound={function(){
          console.log("No user logged in.");
        }}
      />
    );
  }
});
```

### FBLoginManager
Wraps various features of the  `FBSDKLoginManager` and provides interaction through callback functions and firing events.
See `FBLoginMock.js` for an example using only exposed native methods to recreate the native `FBSDKLoginButton`.
