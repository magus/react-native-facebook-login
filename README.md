# react-native-facebook-login
`<FBLogin />` provides a React Native component wrapping the native Facebook SDK login button and manager.


<img src="preview.gif" alt="preview" height="450">

## todo
- Polish, package and publish

## setup
- Facebook SDK setup (link)
- ```command to open module directory```
  - Drag `RCTFBLogin.xcodeproj` into your Libraries folder in xcode
- Project settings > Add link to static library
- ⌘+R


## usage

```js
var FBLogin = require('FBLogin');

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
