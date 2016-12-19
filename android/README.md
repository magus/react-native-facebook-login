# Android Setup: react-native-facebook-login

**Assumptions**
- You have a [Facebook App Setup](https://developers.facebook.com/quickstarts/?platform=android) (Key Hash, App Id, etc)
- You installed this module via npm

#### Step 1 - Update Gradle Settings

```gradle
// file: android/settings.gradle
...

include ':react-native-facebook-login'
project(':react-native-facebook-login').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-facebook-login/android')
```

#### Step 2 - Update Gradle Build

```gradle
// file: android/app/build.gradle
...

dependencies {
    ...
    compile project(':react-native-facebook-login')
}
```

#### Step 3 - Register React Package 

```java
//file: android/app/src/main/java/com/{Your Package Name}/MainApplication.java
...
import com.magus.fblogin.FacebookLoginPackage; // <--- import

public class MainApplication extends Application implements ReactApplication {

    ...

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new FacebookLoginPackage() // <------ add the package
        );
    }

    ...
}
```

#### Step 4 - Add Facebook App ID to String resources

```xml
 <!-- file: android/app/src/main/res/values/strings.xml -->
<resources>
    <string name="app_name">{Your_App_Name}</string>
    <string name="fb_app_id">{FB_APP_ID}</string>
    <string name="fb_login_protocol_scheme">fb{FB_APP_ID}</string>
</resources>
```

#### Step 5 - update AndroidManifest

```xml
 <!-- file: android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          xmlns:tools="http://schemas.android.com/tools"
          package="com.your.app.namespace">

    ...

    <application
            android:allowBackup="true"
            android:label="@string/app_name"
            android:icon="@mipmap/ic_launcher"
            android:theme="@style/AppTheme">
        ...

        <!--add FacebookActivity-->
        <activity tools:replace="android:theme"
                android:name="com.facebook.FacebookActivity"
                android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation"
                android:label="@string/app_name"
                android:theme="@android:style/Theme.Translucent.NoTitleBar"/>

        <!--add CustomTabActivity-->
        <activity
            android:name="com.facebook.CustomTabActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="@string/fb_login_protocol_scheme" />
            </intent-filter>
        </activity>

        <!--reference your fb_app_id-->
        <meta-data
                android:name="com.facebook.sdk.ApplicationId"
                android:value="@string/fb_app_id"/>

    </application>

</manifest>
```

#### Step 6 - include in Javascript

```js
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';

/**
  eg.
  Please note:
  - if buttonView is not set then a default view will be shown
  - this is not meant to be a full example but highlights what you have access to
**/
<FBLogin
    buttonView={<FBLoginView />}
    ref={(fbLogin) => { this.fbLogin = fbLogin }}
    loginBehavior={FBLoginManager.LoginBehaviors.Native}
    permissions={["email","user_friends"]}
    onLogin={function(e){console.log(e)}}
    onLoginFound={function(e){console.log(e)}}
    onLoginNotFound={function(e){console.log(e)}}
    onLogout={function(e){console.log(e)}}
    onCancel={function(e){console.log(e)}}
    onPermissionsMissing={function(e){console.log(e)}}
  />
```

eg. FBLoginView class
```js
import React, { Component } from 'react';
import { StyleSheet,Text,View } from 'react-native';
var Icon = require('react-native-vector-icons/FontAwesome');

/**
  Example FBLoginView class
  Please note:
  - this is not meant to be a full example but highlights what you have access to
  - If you use a touchable component, you will need to set the onPress event like below
**/
class FBLoginView extends Component {
  static contextTypes = {
    isLoggedIn: React.PropTypes.bool,
    login: React.PropTypes.func,
    logout: React.PropTypes.func,
    props: React.PropTypes.object
	};

  constructor(props) {
      super(props);
    }

    render(){
        return (
          <View style={[]}>
            <Icon.Button onPress={() => {
                if(!this.context.isLoggedIn){
                  this.context.login()
                }else{
                  this.context.logout()
                }

              }}
              color={"#000000"}
              backgroundColor={"#ffffff"} name={"facebook"}  size={20} borderRadius={100} >

            </Icon.Button>
          </View>
      )
    }
}
module.exports = FBLoginView;
```

### Tips

#### Android version now has a `setLoginBehavior()` function

You can use this to set the login behavior when not using the default button.
It accepts a value from the enum `FBLoginManager.LoginBehaviors`
eg.

```js
FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Native);
```

#### Login Behavior Differences

LoginBehaviors enum seems to be diff from IOS so a mapping was done but there are still two differences:
- `Browser` **(IOS only)**  [if used, this will default to **Native**]
- `NativeOnly` **(Android only)**

```js
// android interpretation of loginBehaviors
// these will map to the android sdk LoginBehavior enum
FBLoginManager.LoginBehaviors = {
   SystemAccount: "DEVICE_AUTH",
   NativeOnly: "NATIVE_ONLY",
   Native: "NATIVE_WITH_FALLBACK", // android default
   Web: "WEB_ONLY",
   Katana: "KATANA_ONLY",
   WebView: "WEB_VIEW_ONLY"
}
```

Given this information, some apps may still want to use different behaviors per platform.
A simple solution you may use is as follows:

```js
//eg.
import { Platform } from 'react-native';
import {FBLoginManager} from 'react-native-facebook-login';
var LoginBehavior = {
  'ios': FBLoginManager.LoginBehaviors.Browser,
  'android': FBLoginManager.LoginBehaviors.Native
}

...

<FBLogin
    loginBehavior={LoginBehavior[Platform.OS]}
  />

```

#### In some cases we were getting the following error when compiling

```java
Unknown source file : UNEXPECTED TOP-LEVEL EXCEPTION:
Unknown source file : com.android.dex.DexException: Multiple dex files define Lbolts/AggregateException;
```
This happens because Gradle is trying to load two versions of bolts.

Current Solution that works:

We are excluding bolts from the FB SDK in order to avoid this collision

```gradle
compile ('com.facebook.android:facebook-android-sdk:4.16.+'){
        exclude group: 'com.parse.bolts', module: 'bolts-android';
        exclude group: 'com.parse.bolts', module: 'bolts-applinks';
        exclude group: 'com.parse.bolts', module: 'bolts-tasks';
    }
```

If this gives issues in the future, please report an issue.

Thanks.

### TroubleShooting

**Receiving issues After an update? Please:**

- Ensure this module is up to date
- Clean your gradle build `cd android && ./gradlew clean && cd ..`
- Ensure your `AndroidManifest.xml` and `strings.xml` are up to date
- Double check setup guide on the [Facebook Documentation](https://developers.facebook.com/docs/facebook-login/android) for your sanity

If you are still receiving issues after all this then open an issue.

Thanks
