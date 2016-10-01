package com.magus.fblogin;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookRequestError;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.login.LoginBehavior;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.text.SimpleDateFormat;
import java.util.Map;

public class FacebookLoginModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private final String CALLBACK_TYPE_SUCCESS = "success";
    private final String CALLBACK_TYPE_ERROR = "error";
    private final String CALLBACK_TYPE_CANCEL = "cancel";

    private CallbackManager mCallbackManager;
    private Callback mTokenCallback;
    private Callback mLogoutCallback;

    public FacebookLoginModule(ReactApplicationContext reactContext) {
        super(reactContext);

        reactContext.addActivityEventListener(this);

        FacebookSdk.sdkInitialize(reactContext.getApplicationContext());

        mCallbackManager = CallbackManager.Factory.create();

        LoginManager.getInstance().registerCallback(mCallbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(final LoginResult loginResult) {
                        if (loginResult.getRecentlyGrantedPermissions().size() > 0) {

                            GraphRequest request = GraphRequest.newMeRequest(
                                    loginResult.getAccessToken(),
                                    new GraphRequest.GraphJSONObjectCallback() {
                                        @Override
                                        public void onCompleted(JSONObject me, GraphResponse response) {
                                            if (mTokenCallback != null) {
                                                FacebookRequestError error = response.getError();

                                                if (error != null) {
                                                    WritableMap map = Arguments.createMap();

                                                    map.putString("errorType", error.getErrorType());
                                                    map.putString("message", error.getErrorMessage());
                                                    map.putString("recoveryMessage", error.getErrorRecoveryMessage());
                                                    map.putString("userMessage", error.getErrorUserMessage());
                                                    map.putString("userTitle", error.getErrorUserTitle());
                                                    map.putInt("code", error.getErrorCode());
                                                    map.putString("eventName", "onError");

                                                    consumeCallback(CALLBACK_TYPE_ERROR, map);
                                                } else {
                                                    WritableMap map = Arguments.createMap();
                                                    map.putMap("credentials", getCredentialsFromToken(AccessToken.getCurrentAccessToken()));
                                                    //TODO: figure out a way to return profile as WriteableMap
                                                    //    OR: expose method to get current profile
                                                    map.putString("profile", me.toString());
                                                    map.putString("eventName", "onLogin");

                                                    consumeCallback(CALLBACK_TYPE_SUCCESS, map);
                                                }
                                            }
                                        }
                                    });
                            Bundle parameters = new Bundle();
                            String fields = "id,name,email,first_name,last_name," +
                                    "age_range,link,picture,gender,locale,timezone," +
                                    "updated_time,verified";
                            parameters.putString("fields", fields);
                            request.setParameters(parameters);
                            request.executeAsync();
                        } else {
                            handleError("Insufficient permissions", "onPermissionsMissing", CALLBACK_TYPE_ERROR);
                        }
                    }

                    @Override
                    public void onCancel() {
                        if (mTokenCallback != null) {
                            WritableMap map = Arguments.createMap();
                            map.putString("message", "FacebookCallback onCancel event triggered");
                            map.putString("eventName", "onCancel");
                            consumeCallback(CALLBACK_TYPE_CANCEL, map);
                        }
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        if (mTokenCallback != null) {
                            WritableMap map = Arguments.createMap();

                            map.putString("message", exception.getMessage());
                            map.putString("eventName", "onError");

                            consumeCallback(CALLBACK_TYPE_ERROR, map);
                        }
                    }
                });
    }

    private void handleError(String value, String onPermissionsMissing, String callbackType) {
        WritableMap map = Arguments.createMap();

        map.putString("message", value);
        map.putString("eventName", onPermissionsMissing);

        consumeCallback(callbackType, map);
    }

    private void consumeCallback(String type, WritableMap map) {
        if (mTokenCallback != null) {
            AccessToken accessToken = AccessToken.getCurrentAccessToken();
            map.putString("type", type);
            map.putString("provider", "facebook");
            map.putArray("declinedPermissions", getDeclinedPermissions(accessToken));

            if(type.equals(CALLBACK_TYPE_SUCCESS)){
                mTokenCallback.invoke(null, map);
            }else{
                mTokenCallback.invoke(map, null);
            }

            mTokenCallback = null;
        }
    }

    @Override
    public String getName() {
        return "MFBLoginManager";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("LoginBehaviors", getLoginBehaviorMap());
        return constants;
    }

    private Map<String,String>  getLoginBehaviorMap(){
        Map<String,String> LoginBehaviourMap = new HashMap<String, String>();
        /**
         * Getting LoginBehaviours in natural state
         *
            for (LoginBehavior type : LoginBehavior.values()) {
                LoginBehaviourMap.put(type.name(), type.name());
            }
         */

        /**
         * Mapping to React-Native enum types
         * Notes:
         * - there is no browser behaviour in this android sdk
         * - NativeOnly is unique to android
         */
        LoginBehaviourMap.put("Native", LoginBehavior.NATIVE_WITH_FALLBACK.name());
        LoginBehaviourMap.put("NativeOnly", LoginBehavior.NATIVE_ONLY.name());
        LoginBehaviourMap.put("SystemAccount", LoginBehavior.DEVICE_AUTH.name());
        LoginBehaviourMap.put("Web", LoginBehavior.WEB_ONLY.name());
        LoginBehaviourMap.put("WebView", LoginBehavior.WEB_VIEW_ONLY.name());
        LoginBehaviourMap.put("Katana", LoginBehavior.KATANA_ONLY.name());

        return LoginBehaviourMap;
    }

    private WritableMap mapBehavior(){
        WritableMap map = Arguments.createMap();
        LoginBehavior loginBehavior = LoginManager.getInstance().getLoginBehavior();
        map.putString("name", loginBehavior.name());
        map.putInt("ordinal", loginBehavior.ordinal());
        return map;
    }

    @ReactMethod
    public void setLoginBehavior(String loginBehavior, Promise promise){
        Log.i("LoginBehavior", "Received: " + loginBehavior);
        if(loginBehavior != null && (loginBehavior != null && LoginBehavior.valueOf(loginBehavior) != null)){
            LoginManager.getInstance().setLoginBehavior(LoginBehavior.valueOf(loginBehavior));
        }
        String currentLoginBehaviorName = LoginManager.getInstance().getLoginBehavior().name();
        Log.i("LoginBehavior", "Using: " + currentLoginBehaviorName);
        promise.resolve(mapBehavior());
    }

    @ReactMethod
    public void getLoginBehavior(final Callback callback){
        LoginBehavior loginBehavior = LoginManager.getInstance().getLoginBehavior();
        Log.i("LoginBehavior", "Using: " + loginBehavior.name());
        callback.invoke(mapBehavior());
    }

    @ReactMethod
    public void loginWithPermissions(ReadableArray permissions, final Callback callback) {
        String loginType = "loginWithPermissions";
        login(permissions, loginType, callback);
    }

    @ReactMethod
    public void logInWithPublishPermissions(ReadableArray permissions, final Callback callback) {
        String loginType = "logInWithPublishPermissions";
        login(permissions, loginType, callback);
    }

    private void login(ReadableArray permissions, String loginType, Callback callback) {
        if (mTokenCallback != null) {
            AccessToken accessToken = AccessToken.getCurrentAccessToken();

            WritableMap map = Arguments.createMap();

            if (accessToken != null) {
                map.putMap("credentials", getCredentialsFromToken(AccessToken.getCurrentAccessToken()));
                map.putString("eventName", "onLoginFound");
                map.putBoolean("cache", true);
                consumeCallback(CALLBACK_TYPE_SUCCESS, map);
            } else {
                map.putString("message", "Cannot register multiple callbacks");
                map.putString("eventName", "onCancel");
                consumeCallback(CALLBACK_TYPE_CANCEL, map);
            }
        }

        mTokenCallback = callback;

        List<String> _permissions = getPermissions(permissions);
        if(_permissions != null && _permissions.size() > 0){
            Log.i("FBLoginPermissions", "Using: " + _permissions.toString());

            Activity currentActivity = getCurrentActivity();

            if(currentActivity != null){
                Log.i("FBLoginBehavior", "Using for login: " + LoginManager.getInstance().getLoginBehavior().name());

                switch (loginType) {
                    case "logInWithReadPermissions":
                        LoginManager.getInstance().logInWithReadPermissions(currentActivity, _permissions);
                        break;
                    case "logInWithPublishPermissions":
                        LoginManager.getInstance().logInWithPublishPermissions(currentActivity, _permissions);
                        break;

                    default:
                        LoginManager.getInstance().logInWithReadPermissions(currentActivity, _permissions);
                        break;
                }
            }else{
                handleError("Activity doesn't exist", "onError", CALLBACK_TYPE_ERROR);
            }
        }else{
            handleError("Insufficient permissions", "onPermissionsMissing", CALLBACK_TYPE_ERROR);
        }
    }

    @ReactMethod
    public void logout(final Callback callback) {
        WritableMap map = Arguments.createMap();

        mTokenCallback = callback;
        LoginManager.getInstance().logOut();

        map.putString("message", "Facebook Logout executed");
        map.putString("eventName", "onLogout");
        consumeCallback(CALLBACK_TYPE_SUCCESS, map);

    }

    private List<String> getPermissions(ReadableArray permissions) {
        List<String> _permissions = new ArrayList<String>();
//        List<String> defaultPermissions = Arrays.asList("public_profile", "email");
        if(permissions != null && permissions.size() > 0){
            for(int i = 0; i < permissions.size(); i++){
                if(permissions.getType(i).name() == "String"){
                    String permission = permissions.getString(i);
                    Log.i("FBLoginPermissions", "adding permission: " + permission);
                    _permissions.add(permission);
                }
            }
        }

//        if(_permissions == null || _permissions.size() < 1){
//            _permissions = defaultPermissions;
//        }
        return _permissions;
    }

    @ReactMethod
    public void getCredentials(final Callback callback) {
        AccessToken currentAccessToken = AccessToken.getCurrentAccessToken();
        WritableMap map = Arguments.createMap();
        if(currentAccessToken != null){
            map.putMap("credentials", getCredentialsFromToken(currentAccessToken) );
            map.putString("type", CALLBACK_TYPE_SUCCESS);
            map.putString("eventName", "onLoginFound");
        }else{
            map.putString("type", CALLBACK_TYPE_CANCEL);
            map.putString("eventName", "onLoginNotFound");
            map.putString("message", "No user found");
        }

        map.putString("provider", "facebook");
        map.putArray("declinedPermissions", getDeclinedPermissions(currentAccessToken));
        callback.invoke(null, map);
    }

    private WritableMap getCredentialsFromToken(AccessToken currentAccessToken){
        WritableMap map = Arguments.createMap();
        WritableArray array = Arguments.createArray();
        if(currentAccessToken != null){
            if(currentAccessToken.getPermissions() != null){
                for (String value: currentAccessToken.getPermissions()) {
                    array.pushString(value);
                }
            }

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
            map.putString("token", currentAccessToken.getToken());
            map.putString("userId", currentAccessToken.getUserId());
            map.putString("tokenExpirationDate", sdf.format(currentAccessToken.getExpires()) );
            map.putArray("permissions", array);
        }

        return map;
    }

    private WritableArray getDeclinedPermissions(AccessToken currentAccessToken){
        WritableArray array = Arguments.createArray();
        if(currentAccessToken != null && currentAccessToken.getDeclinedPermissions() != null){
            for (String value: currentAccessToken.getDeclinedPermissions()) {
                array.pushString(value);
            }
        }

        return array;
    }

    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }

    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }

    public void onNewIntent(Intent intent) {

    }
}
