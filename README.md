# React Native : Facebook SDK Login Button
`<FBLogin />` provides a [React Native][react-native] component wrapping the native [Facebook SDK login button](fb-sdk-loginbutton) and [manager](fb-sdk-loginmanager).

<img src="https://raw.githubusercontent.com/magus/react-native-facebook-login/master/preview.gif" alt="preview" height="450">

**Note**: Demo above includes debug text to confirm login (i.e. user name, email and access token). `<FBLogin />`, by default, will only display the native blue 'Log in with Facebook' button.

## Table of contents
- [Usage](#usage)
- [Setup](#setup)
- [Example project](#example-project)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Copyright and license](#copyright-and-license)

## Usage

### FBLogin
Provides a React Native component which wraps the Facebook SDK `FBSDKLoginButton`.

```js
var FBLogin = require('react-native-facebook-login');

var Login = React.createClass({
  render: function() {
    return (
      <FBLogin style={{ marginTop: 150, }}
        permissions={["email","user_friends"]}
        onLogin={function(data){
          console.log("Logged in!");
          console.log(data.credentials);
        }}
        onLogout={function(){
          console.log("Logged out.");
        }}
      />
    );
  }
});
```

## FBLoginManager
Wraps features of the native iOS Facebook SDK `FBSDKLoginManager` interface.

See [example/components/facebook/FBLoginMock.js](example/components/facebook/FBLoginMock.js) for an example using only the exposed native methods of the FBLoginManager to recreate the native `FBSDKLoginButton`.

### Usage
```js
var FBLoginManager = require('NativeModules').FBLoginManager;

FBLoginManager.loginWithPermissions(["email","user_friends"], function(error, data){
  if (!error) {
    console.log("Login data: ", data);
  } else {
    console.log("Error: ", data);
  }
})
```

## FBLoginManager.Events
A variety of events are emitted across the React Native bridge back to your javascript components. This means you can take advantage of the `RCTDeviceEventEmitter.addListener` method to listen, and create subscribers that will execute, for each action. In fact, this is how the onEvent handlers are implemented for the FBLogin component (see [FBLogin.ios.js](FBLogin.ios.js)).

### Usage
```js
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var FBLoginManager = require('NativeModules').FBLoginManager;

...

var subscriber = RCTDeviceEventEmitter.addListener(
  FBLoginManager.Events["Login"],
  (eventData) => {
    console.log("[Login] ", eventData);
  }
);

...

// Be sure to remove subscribers when they are no longer needed
// e.g. componentWillUnmount
subscriber.remove();
```

## Setup
```sh
npm install --save react-native-facebook-login
```
- Run ```open node_modules/react-native-facebook-login```
- Drag `RCTFBLogin.xcodeproj` into your `Libraries` group
- Select your main project in the navigator to bring up settings
- Under `Build Phases` expands the `Link Binary With Libraries` header
- Scroll down and click the `+` to add a
- Find and add `libRTCFBLogin.a` under the `Workspace` group
- ⌘+B

**Note**: If your build fails, you most likely forgot to setup the [Facebook SDK](#facebook-sdk)

### Facebook SDK
[Facebook : Quick Start for iOS](https://developers.facebook.com/quickstarts/?platform=ios)

### Adding the Facebook SDK
- Run `open node_modules/react-native-facebook-login/FacebookSDK`
- Select all the `.framework` files and click drag them into your project
- Be sure to [configure your .plist file](https://developers.facebook.com/docs/ios/getting-started#configurePlist)

## Example project
### Toy
```sh
open example/toy.xcodeproj
```

See the [example](example/) project for a working example.

## Documentation
TODO

## Contributing
Just submit a pull request!

Use the simple toy project under the example directory to verify your changes.

```sh
open example/toy.xcodeproj
```

## todo
- Auth with javascript Api as an exposed method on button
- Clean up duplicate code in login methods
- documentation for FBLogin component props, expected values (FB SDK links), etc.
- expose RCT_EXPORT functions on FBLogin, docs as component method, use 'refs' to call - login/logout/getCredentials as methods via FBLogin component ref
- writePermissions parameter for button

## Copyright and license

Code and documentation copyright 2015 Noah M Jorgenson. Code released under [the MIT license](https://github.com/magus/react-native-facebook-login/blob/master/LICENSE).


[react-native]: http://facebook.github.io/react-native/
[fb-sdk-loginbutton]: https://developers.facebook.com/docs/facebook-login/ios/v2.3#login-button
[fb-sdk-loginmanager]: https://developers.facebook.com/docs/facebook-login/ios/v2.3#login-apicalls
