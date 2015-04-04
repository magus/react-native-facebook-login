# react-native-facebook-login
`<FBLogin />` provides a React Native component wrapping the native Facebook SDK login button and manager.

<img src="preview.gif" alt="preview" height="450">

## setup
- `npm install --save react-native-facebook-login`
- Facebook SDK setup (link)
- ```open node_modules/react-native-facebook-login```
- Drag `RCTFBLogin.xcodeproj` into your `Libraries` group
- Select your main project in the navigator to bring up settings
- Under `Build Phases` expands the `Link Binary With Libraries` header
- Scroll down and click the `+`
- Find and add `libRTCFBLogin.a`
- ⌘+R and enjoy!


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

### FBLogin
TODO: Document the props, expected values (FB SDK links), etc.

### FBLoginManager
Wraps features of the native iOS Facebook SDK `FBSDKLoginManager` interface. Provides interaction through callback functions and firing events which can be observed through the `RCTDeviceEventEmitter.addListener` method.

See [example/components/facebook/FBLoginMock.js](example/components/facebook/FBLoginMock.js) for an example using only the exposed native methods of the FBLoginManager to recreate the native `FBSDKLoginButton`.
