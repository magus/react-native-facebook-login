# react-native-facebook-login
`<FBLogin />` provides a React Native component wrapping the native Facebook SDK login button and manager.

<img src="preview.gif" alt="preview" height="450">

## usage
```js
var FBLogin = require('react-native-facebook-login');

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
      />
    );
  }
});
```

## setup
```sh
npm install --save react-native-facebook-login
```
- Run ```open node_modules/react-native-facebook-login```
- Drag `RCTFBLogin.xcodeproj` into your `Libraries` group
- Select your main project in the navigator to bring up settings
- Under `Build Phases` expands the `Link Binary With Libraries` header
- Scroll down and click the `+`
- Find and add `libRTCFBLogin.a`
- ⌘+R and enjoy!

**Note**: While the RCTFBLogin project contains references to the necessary Facebook SDK frameworks. You will still need to ensure you have setup the Facebook SDK for use with your app. See the [example/toy.xcodeproj](example/toy.xcodeproj) project for an example or follow the instructions from the [Facebook quick start guide](https://developers.facebook.com/docs/ios/getting-started#).

### FBLogin
TODO: Document the props, expected values (FB SDK links), etc.

### FBLoginManager
Wraps features of the native iOS Facebook SDK `FBSDKLoginManager` interface. Provides interaction through callback functions and firing events which can be observed through the `RCTDeviceEventEmitter.addListener` method.

See [example/components/facebook/FBLoginMock.js](example/components/facebook/FBLoginMock.js) for an example using only the exposed native methods of the FBLoginManager to recreate the native `FBSDKLoginButton`.
