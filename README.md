# React Native : Facebook SDK Login Button
`<FBLogin />` provides a [React Native][react-native] component wrapping the native [Facebook SDK login button](fb-sdk-loginbutton) and [manager](fb-sdk-loginmanager).

<img src="preview.gif" alt="preview" height="450">

## Usage
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

## Setup
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


## todo
documentation for FBLogin component

expose RCT_EXPORT functions on FBLogin, docs as component method, use 'refs' to call login/logout/getCredentials via FBLogin component



create @"LoginFound" event which is fired when the button is created



writePermissions for button
  break up 'permissions' argument array into two parameters passed to native module?
  writePermissions & readPermissions?


## Contributing
```sh
cd example && npm install react-native

ROOT="$(git rev-parse --show-toplevel)";
EXAMPLE_MODULE="$ROOT/example/node_modules/react-native-facebook-login/";

mkdir $EXAMPLE_MODULE;

function linkModule() {
  ln -s $ROOT/$@ $EXAMPLE_MODULE/$@
}

linkModule "FacebookSDK";
linkModule "FBLogin.ios.js";
linkModule "RCTFBLogin";
linkModule "RCTFBLogin.xcodeproj";
linkModule "package.json";

open toy.xcodeproj
```
This will install the react-native dependency in the local node_modules folder of the toy example project, then link the local copy of react-native-facebook-login to the node_modules folder of toy example project. Now you can make changes to the toy example and RCTFBLogin.xcodeproj the changes will be reflected in the root git directory for committing.

[react-native]: http://facebook.github.io/react-native/
[fb-sdk-loginbutton]: https://developers.facebook.com/docs/facebook-login/ios/v2.3#login-button
[fb-sdk-loginmanager]: https://developers.facebook.com/docs/facebook-login/ios/v2.3#login-apicalls