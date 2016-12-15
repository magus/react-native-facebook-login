# React Native : Facebook SDK Login Button [![npm version](https://img.shields.io/npm/v/react-native-facebook-login.svg?style=flat)](https://www.npmjs.com/package/react-native-facebook-login)
`<FBLogin />` provides a [React Native][react-native] component wrapping the native [Facebook SDK login button](https://developers.facebook.com/docs/reference/ios/current/class/FBSDKLoginButton/) and [manager](https://developers.facebook.com/docs/reference/ios/current/class/FBSDKLoginManager/).


<img src="https://raw.githubusercontent.com/magus/react-native-facebook-login/master/images/preview.gif" alt="preview" />

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

##### Defaults
```js
import React, { PropTypes, Component } from 'react';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');

class Login extends Component {
  render() {
    return (
      <FBLogin />
    );
  }
};
```

##### Exhaustive
```js
import React, { PropTypes, Component } from 'react';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');

class Login extends Component {
  render() {
    var _this = this;
    return (
      <FBLogin style={{ marginBottom: 10, }}
        ref={(fbLogin) => { this.fbLogin = fbLogin }}
        permissions={["email","user_friends"]}
        loginBehavior={FBLoginManager.LoginBehaviors.Native}
        onLogin={function(data){
          console.log("Logged in!");
          console.log(data);
          _this.setState({ user : data.credentials });
        }}
        onLogout={function(){
          console.log("Logged out.");
          _this.setState({ user : null });
        }}
        onLoginFound={function(data){
          console.log("Existing login found.");
          console.log(data);
          _this.setState({ user : data.credentials });
        }}
        onLoginNotFound={function(){
          console.log("No user logged in.");
          _this.setState({ user : null });
        }}
        onError={function(data){
          console.log("ERROR");
          console.log(data);
        }}
        onCancel={function(){
          console.log("User cancelled.");
        }}
        onPermissionsMissing={function(data){
          console.log("Check permissions!");
          console.log(data);
        }}
      />
    );
  }
};
```

#### Login Behavior
You can change the [FBSDK login behavior](https://developers.facebook.com/docs/reference/ios/current/class/FBSDKLoginManager/#FBSDKLoginBehavior%20enum) of the button by including the `loginBehavior` prop on the `FBLogin` component.

- `FBLoginManager.LoginBehaviors.Native`: This is the default behavior, and indicates logging in through the native Facebook app may be used. The SDK may still use Safari instead.
- `FBLoginManager.LoginBehaviors.Browser`: Attempts log in through the Safari or SFSafariViewController, if available.
- `FBLoginManager.LoginBehaviors.SystemAccount`: Attempts log in through the Facebook account currently signed in through the device Settings.
- `FBLoginManager.LoginBehaviors.Web`: Attempts log in through a modal UIWebView pop up.

## FBLoginManager
Wraps features of the native iOS Facebook SDK `FBSDKLoginManager` interface.

See [example/components/facebook/FBLoginMock.js](example/components/facebook/FBLoginMock.js) for an example using only the exposed native methods of the FBLoginManager to recreate the native `FBSDKLoginButton`.

### Usage
```js
var {FBLoginManager} = require('react-native-facebook-login');

FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web); // defaults to Native

FBLoginManager.loginWithPermissions(["email","user_friends"], function(error, data){
  if (!error) {
    console.log("Login data: ", data);
  } else {
    console.log("Error: ", error);
  }
})
```

## FBLoginManager.Events
A variety of events are emitted across the React Native bridge back to your javascript components. This means you can take advantage of the `RCTDeviceEventEmitter.addListener` method to listen, and create subscribers that will execute, for each action. In fact, this is how the onEvent handlers are implemented for the FBLogin component (see [FBLogin.ios.js](FBLogin.ios.js)).

### Usage
```js
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var {FBLoginManager} = require('react-native-facebook-login');

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
### [Android](/android)
[Click here for Android setup instructions](/android/README.md)

### iOS
```sh
npm install --save react-native-facebook-login
```
- Run ```open node_modules/react-native-facebook-login```
- Have your react native xcode project open and drag `RCTFBLogin.xcodeproj` into your `Libraries` group.
- Select your main project in the navigator to bring up settings
- Under `Build Phases` expand the `Link Binary With Libraries` header
- Scroll down and click the `+` to add a library
- Find and add `libRCTFBLogin.a` under the `Workspace` group
- ⌘+B

**Note**: If your build fails, you most likely forgot to setup the [Facebook SDK](#facebook-sdk)

#### Facebook SDK
[Facebook : Quick Start for iOS](https://developers.facebook.com/quickstarts/?platform=ios)

Be sure to [configure your .plist file](https://developers.facebook.com/docs/ios/getting-started#xcode). This file is located under the `ios/<project-name>` directory of your generated react-native project. It should be in the same folder as your `AppDelegate.m` file.

As of iOS 9 you must now explicitly whitelist requests your application makes in the `Info.plist`. Be sure to [follow the instructions for iOS 9](https://developers.facebook.com/docs/ios/ios9) during the setup process.

- Specifically, you will need to add the following to your `Info.plist` file

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
        <string>fbapi</string>
        <string>fb-messenger-api</string>
        <string>fbauth2</string>
        <string>fbshareextension</string>
</array>
```

##### Adding the Facebook SDK
- Run `open node_modules/react-native-facebook-login/FacebookSDK`
- Open your main project in xcode and right click on your project’s name in the left sidebar and select “New Group” and type in “Frameworks”.
- Select all the `.framework` files in the FacebookSDK folder and click drag them into the Frameworks folder/group you just created in xcode or highlight the Frameworks group in left sidebar and go to File > Add files to "yourProjectName" and select the `.framework` files.
- Select your main project in the navigator to bring up settings
- Under `Build Settings` scroll down to `Search Paths`
- Add the following path to your `Framework Search Paths`

```sh
$(SRCROOT)/../node_modules/react-native-facebook-login/FacebookSDK
```

<img src="https://raw.githubusercontent.com/magus/react-native-facebook-login/master/images/framework-search-paths.png" alt="framework-search-paths" />

##### AppDelegate.m modifications
- Add the following import statements for FBSDK kits at the top of your `AppDelegate.m`

```objectivec
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
```

- Modify the application didFinishLaunchingWithOptions method to return FBSDKApplicationDelegate instead of `YES`

```objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // ...
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  // return YES;
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                    didFinishLaunchingWithOptions:launchOptions];
}
```

- Add the following new methods after the application didFinishLaunchingWithOptions method above, before the `@end`.

```objectivec
// Facebook SDK
- (void)applicationDidBecomeActive:(UIApplication *)application {
    [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                          openURL:url
                                                sourceApplication:sourceApplication
                                                       annotation:annotation];
}
```

<img src="https://raw.githubusercontent.com/magus/react-native-facebook-login/master/images/fbsdkapplicationdelegate-methods-example.png" alt="example-fbsdk-frameworks" />

## Example project
### Toy
```sh
open example/ios/examples.xcodeproj
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

## Contact
[Twitter - @imnmj](http://twitter.com/imnmj)
[iamnoah.com](http://iamnoah.com)

## todo
- Auth with javascript Api as an exposed method on button
- Clean up duplicate code in login methods
- documentation for FBLogin component props, expected values (FB SDK links), etc.
- expose RCT_EXPORT functions on FBLogin, docs as component method, use 'refs' to call - login/logout/getCredentials as methods via FBLogin component ref
- writePermissions parameter for button

## Copyright and license

Code and documentation copyright 2015 Noah. Code released under [the MIT license](https://github.com/magus/react-native-facebook-login/blob/master/LICENSE).


[react-native]: http://facebook.github.io/react-native/
[fb-sdk-loginbutton]: https://developers.facebook.com/docs/facebook-login/ios/v2.3#login-button
[fb-sdk-loginmanager]: https://developers.facebook.com/docs/facebook-login/ios/v2.3#login-apicalls
