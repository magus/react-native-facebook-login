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

- (NSDictionary *)constantsToExport
{
  return @{
    @"Events": @{
      @"Login": @"FBLoginSuccessEvent",
      @"Logout": @"FBLogoutEvent",
      @"Error": @"FBLoginErrorEvent",
      @"Cancel": @"FBLoginCancelEvent",
      @"PermissionsMissing": @"FBLoginPermissionsMissingEvent",
      @"LoginNotFound": @"FBLoginLoginNotFoundEvent"
    },
  };
}

- (BOOL)hasAllPermissions:(NSSet *)grantedPermissions expectedPermissions:(NSArray *)expectedPermissions {
    // Did we get all the permissions?
    BOOL allPermissions = YES;
    for (NSString *permission in expectedPermissions) {
        allPermissions = allPermissions && [grantedPermissions containsObject:permission];
    }

    return allPermissions;
}

- (NSDictionary *)buildCredentials:(FBSDKAccessToken *)token {
    NSString *tokenString = token.tokenString;
    NSString *userId = token.userID;
    NSArray *permissions = [token.permissions allObjects];
    //[[token.permissions allObjects] componentsJoinedByString:@", "]

    return @{
             @"token" : tokenString,
             @"userId" : userId,
             @"permissions" : permissions};
}

- (void) fireEvent:(NSString *)event {
    [self fireEvent:event withMessage:nil];
}

- (void) fireEvent:(NSString *)event withMessage:(NSString *)message {
    NSString *eventName = self.constantsToExport[@"Events"][event];
    [self.bridge.eventDispatcher sendDeviceEventWithName:eventName
                                                    body:@{@"message": message ? message : @""}];
}

- (void)  loginButton:(FBSDKLoginButton *)loginButton
didCompleteWithResult:(FBSDKLoginManagerLoginResult *)result
                error:(NSError *)error{
    if (error) {
        [self fireEvent:@"Error" withMessage:error.localizedDescription];

    } else if (result.isCancelled) {
        [self fireEvent:@"Cancel"];
    } else {
        if ([self hasAllPermissions:result.grantedPermissions expectedPermissions:loginButton.readPermissions]) {
            [self fireEvent:@"Login"];
        } else {
            [self fireEvent:@"PermissionsMissing"];
        }
    }
}

- (void)loginButtonDidLogOut:(FBSDKLoginButton *)loginButton{
    [self fireEvent:@"Logout"];
}

- (void)login:(RCTResponseSenderBlock)callback {
    RCT_EXPORT();
    [self loginWithPermissions:_defaultPermissions callback:callback];
}

- (void)loginWithPermissions:(NSArray *)permissions callback:(RCTResponseSenderBlock)callback {
    RCT_EXPORT();

    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logInWithReadPermissions:permissions handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        if (error) {
            [self fireEvent:@"Error" withMessage:error.localizedDescription];
            callback(@[error.localizedDescription, [NSNull null]]);
        } else if (result.isCancelled) {
            [self fireEvent:@"Cancel"];
            callback(@[@"Cancel", [NSNull null]]);
        } else {
            if ([self hasAllPermissions:result.grantedPermissions expectedPermissions:permissions]) {
                FBSDKAccessToken *token = result.token;
                NSDictionary *credentials = [self buildCredentials:token];

                [self fireEvent:@"Login"];
                callback(@[[NSNull null], credentials]);
            } else {
                [self fireEvent:@"PermissionsMissing"];
                callback(@[@"PermissionsMissing", [NSNull null]]);
            }
        }
    }];
}

- (void)getCredentials:(RCTResponseSenderBlock)callback {
    RCT_EXPORT();

    if ([FBSDKAccessToken currentAccessToken]) {
        FBSDKAccessToken *token = [FBSDKAccessToken currentAccessToken];
        NSDictionary *credentials = [self buildCredentials:token];
        callback(@[[NSNull null], credentials]);
    } else {
        [self fireEvent:@"LoginNotFound"];
        callback(@[@"LoginNotFound", [NSNull null]]);
    }
}

- (void)logout:(RCTResponseSenderBlock)callback {
    RCT_EXPORT();
    
    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logOut];
    [self fireEvent:@"Logout"];
    callback(@[[NSNull null], @"Logout"]);
}

@end
