# toy

## todo
- Wrap FBSDKLoginButton and expose as component to NativeModules (could probably publish this on react rocks or something)
  RTCFBLoginButton
  FBLoginButton.ios.js
  https://github.com/brentvatne/react-native-login/blob/master/RCTVideoManager.m
  https://github.com/brentvatne/react-native-login/blob/master/RCTVideo.m

## setup

Modify the `iOS/AppDelegate.m` file to correctly point to the local js bundle `iOS/main.jsbundle` or the bundle served by packager.

The script below will automatically update the js bundle.
```sh
$(git rev-parse --show-toplevel)/updateBundle.sh
```

The command below will setup a pre-commit hook to call the above script
```sh
ln -s $(git rev-parse --show-toplevel)/updateBundle.sh .git/hooks/pre-commit
```
