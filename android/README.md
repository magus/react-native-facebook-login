# Android Setup: react-native-facebook-login

**Assumptions**
- You have a facebook app setup (Key Hash, App Id, etc)
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

#### Step 3 - Register React Package and Handle onActivityResult

```java
...
import android.content.Intent; // import
import com.magus.fblogin.FacebookLoginPackage; // import

public class MainActivity extends ReactActivity {

    // declare package
    private FacebookLoginPackage mFacebookLoginPackage;

    ...
    
    @Override
    protected List<ReactPackage> getPackages() {

        mFacebookLoginPackage = new FacebookLoginPackage(this); //Instantiate

        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            mFacebookLoginPackage); // Add to the package list
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // handle onActivityResult
        mFacebookLoginPackage.handleActivityResult(requestCode, resultCode, data);
    }
...

```

#### Step 4 - Add Facebook App ID to String resources

```xml
<resources>
    <string name="app_name">your-app-name</string>
    <string name="fb_app_id">your-fb-app-id</string>
</resources>
```

#### Step 5 - update AndroidManifest

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.your.app.namespace">

    ...

    <application
            android:allowBackup="true"
            android:label="@string/app_name"
            android:icon="@mipmap/ic_launcher"
            android:theme="@style/AppTheme">
        ...

        <!--add FacebookActivity-->
        <activity
                android:name="com.facebook.FacebookActivity"
                android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation"
                android:label="@string/app_name"
                android:theme="@android:style/Theme.Translucent.NoTitleBar"/>

        <!--reference your fb_app_id-->
        <meta-data
                android:name="com.facebook.sdk.ApplicationId"
                android:value="@string/fb_app_id"/>

    </application>

</manifest>
```

#### Step 6 - include in Javascript

```js
var {NativeModules} = require('react-native');
var FBLogin = require('react-native-facebook-login');
var FBLoginManager = NativeModules.FBLoginManager; // if needed

//eg.
<FBLogin
    onLogin={function(e){console.log(e)}}
    onLogout={function(e){console.log(e)}}
    onCancel={function(e){console.log(e)}}
    onPermissionsMissing={function(e){console.log(e)}}
  />
```
