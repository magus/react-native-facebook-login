#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"

#import "RCTFBLogin.h"
#import "RCTFBLoginManager.h"

@implementation RCTFBLoginManager
{
  RCTFBLogin *_fbLogin;
  NSArray *_defaultPermissions;
}

@synthesize bridge = _bridge;

- (UIView *)view
{
  _fbLogin = [[RCTFBLogin alloc] init];
  _defaultPermissions = @[@"email"];

  [_fbLogin setPermissions:_defaultPermissions];
  [_fbLogin setDelegate:self];
  return _fbLogin;
}

RCT_EXPORT_VIEW_PROPERTY(permissions, NSStringArray);

- (NSDictionary *)constantsToExport {
  return @{
    @"Events": @{
      @"Login": @"FBLoginSuccessEvent",
      @"LoginFound": @"FBLoginLoginFoundEvent",
      @"Logout": @"FBLoginLogoutEvent",
      @"Error": @"FBLoginErrorEvent",
      @"Cancel": @"FBLoginCancelEvent",
      @"PermissionsMissing": @"FBLoginPermissionsMissingEvent",
      @"LoginNotFound": @"FBLoginLoginNotFoundEvent"
    },
  };
}

- (BOOL)hasPermission:(NSString *)permission {
  return [[FBSDKAccessToken currentAccessToken] hasGranted:permission];
}

- (NSArray *)getMissingPermissions:(NSArray *)expectedPermissions {
  FBSDKAccessToken *token = [FBSDKAccessToken currentAccessToken];
  NSMutableSet *missingPermissions = [NSMutableSet setWithArray:expectedPermissions];

  if (token) {
    [missingPermissions minusSet:token.permissions];
  }

  return [missingPermissions allObjects];
}


- (NSDictionary *)buildCredentials {
  NSDictionary *credentials = nil;
  FBSDKAccessToken *token = [FBSDKAccessToken currentAccessToken];

  if (token) {
    credentials = @{
      @"token" : token.tokenString,
      @"userId" : token.userID,
      @"permissions" : [token.permissions allObjects]
    };
  }

  return credentials;
}

// fireEvent: trigger events for listeners on javascript components (RCTDeviceEventEmitter.addListener)
- (void) fireEvent:(NSString *)event {
  [self fireEvent:event withData:nil];
}

- (void) fireEvent:(NSString *)event withData:(NSDictionary *)data {
  NSString *eventName = self.constantsToExport[@"Events"][event];
  [self.bridge.eventDispatcher sendDeviceEventWithName:eventName
                                                    body:data];
}


// FBSDKLoginButtonDelegate :: Login
- (void)  loginButton:(FBSDKLoginButton *)loginButton
didCompleteWithResult:(FBSDKLoginManagerLoginResult *)result
                error:(NSError *)error{
  if (error) {
    [self fireEvent:@"Error" withData:@{
      @"description": error.localizedDescription
    }];
  } else if (result.isCancelled) {
    [self fireEvent:@"Cancel"];
  } else {
    NSArray *permissions = [loginButton.readPermissions arrayByAddingObjectsFromArray:loginButton.publishPermissions];
    NSArray *missingPermissions = [self getMissingPermissions:permissions];

    [self fireEvent:@"Login" withData:@{
      @"credentials": [self buildCredentials],
      @"missingPermissions": missingPermissions
    }];

    if (missingPermissions.count > 0) {
      [self fireEvent:@"PermissionsMissing" withData:@{
        @"missingPermissions": missingPermissions
      }];
    }
  }
}

// FBSDKLoginButtonDelegate :: Logout
- (void)loginButtonDidLogOut:(FBSDKLoginButton *)loginButton{
    [self fireEvent:@"Logout"];
}

// Exposed native methods (FBLoginManager.<methodName>)
- (void)login:(RCTResponseSenderBlock)callback {
  RCT_EXPORT();
  [self loginWithPermissions:_defaultPermissions callback:callback];
}

- (void)loginWithPermissions:(NSArray *)permissions callback:(RCTResponseSenderBlock)callback {
  RCT_EXPORT();

  // Detect current access and return if no new permissions requested
  NSDictionary *currentCredentials = [self buildCredentials];
  NSArray *missingPermissions = [self getMissingPermissions:permissions];
  if(currentCredentials && (missingPermissions.count == 0)) {
    [self fireEvent:@"LoginFound" withData:currentCredentials];
    callback(@[[NSNull null], currentCredentials]);
    return;
  }

  // No existing access token or missing permissions
  FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
  [login logInWithReadPermissions:permissions handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
    if (error) {
      [self fireEvent:@"Error" withData:@{
        @"description": error.localizedDescription
      }];
      callback(@[error.localizedDescription, [NSNull null]]);
    } else if (result.isCancelled) {
      [self fireEvent:@"Cancel"];
      callback(@[@"Cancel", [NSNull null]]);
    } else {

      NSArray *missingPermissions = [self getMissingPermissions:permissions];
      NSArray *decliendPermissions = [result.declinedPermissions allObjects];
      NSDictionary *loginData = @{
        @"credentials": [self buildCredentials],
        @"missingPermissions": missingPermissions,
        @"declinedPermissions": decliendPermissions
      };

      [self fireEvent:@"Login" withData:loginData];
      callback(@[[NSNull null], loginData]);

      if (missingPermissions.count > 0) {
          NSDictionary *permissionData = @{
            @"missingPermissions": missingPermissions,
            @"declinedPermissions": decliendPermissions
          };
          [self fireEvent:@"PermissionsMissing" withData:permissionData];
          callback(@[@"PermissionsMissing", permissionData]);
      }
    }
  }];
}

- (void)logout:(RCTResponseSenderBlock)callback {
    RCT_EXPORT();

    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logOut];
    [self fireEvent:@"Logout"];
    callback(@[[NSNull null], @"Logout"]);
}

- (void)getCredentials:(RCTResponseSenderBlock)callback {
    RCT_EXPORT();

    NSDictionary *credentials = [self buildCredentials];
    if(credentials) {
      [self fireEvent:@"LoginFound" withData:credentials];
      callback(@[[NSNull null], credentials]);
    } else {
      [self fireEvent:@"LoginNotFound"];
      callback(@[@"LoginNotFound", [NSNull null]]);
    }
}

@end
