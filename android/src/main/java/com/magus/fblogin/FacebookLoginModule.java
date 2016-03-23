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
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.text.SimpleDateFormat;

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
                        if (loginResult.getRecentlyGrantedPermissions().contains("email")) {

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

                                                    map.putString("token", loginResult.getAccessToken().getToken());
                                                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
                                                    map.putString("expiration", sdf.format(loginResult.getAccessToken().getExpires()));

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
            map.putString("type", type);
            map.putString("provider", "facebook");

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
        return "FBLoginManager";
    }

    @ReactMethod
    public void loginWithPermissions(ReadableArray permissions, final Callback callback) {
        if (mTokenCallback != null) {
            AccessToken accessToken = AccessToken.getCurrentAccessToken();

            WritableMap map = Arguments.createMap();

            if (accessToken != null) {
                map.putString("token", AccessToken.getCurrentAccessToken().getToken());
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
        if(_permissions != null && _permissions.size() > 0 && _permissions.contains("email")){
            Log.i("FBLoginPermissions", "Using: " + _permissions.toString());

            Activity currentActivity = getCurrentActivity();

            if(currentActivity != null){
                LoginManager.getInstance().logInWithReadPermissions(currentActivity, _permissions);
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
    public void getCurrentToken(final Callback callback) {
        AccessToken currentAccessToken = AccessToken.getCurrentAccessToken();
        if(currentAccessToken != null){
            callback.invoke(currentAccessToken.getToken());
        }else{
            callback.invoke("");
        }
    }

    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
