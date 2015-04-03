#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import "RCTBridge.h"

#import "RCTFBLogin.h"
#import "RCTFBLoginManager.h"

@implementation RCTFBLoginManager

@synthesize bridge = _bridge;

- (UIView *)view
{
  return [[RCTFBLogin alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(permissions, NSStringArray);

- (void)login:(RCTResponseSenderBlock)callback {
    RCT_EXPORT();
    
    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logInWithReadPermissions:@[@"public_profile", @"email"] handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        if (error) {
            callback(@[@"Error", [NSNull null]]);
        } else if (result.isCancelled) {
            callback(@[@"Cancelled", [NSNull null]]);
        } else {
            if ([result.grantedPermissions containsObject:@"public_profile"] &&
                [result.grantedPermissions containsObject:@"email"]) {
                FBSDKAccessToken *token = result.token;
                NSString *tokenString = token.tokenString;
                NSString *userId = token.userID;
                NSDictionary *credentials = @{ @"token" : tokenString, @"userId" : userId };
                callback(@[[NSNull null], credentials]);
            } else {
                callback(@[@"PermissionError", [NSNull null]]);
            }
        }
    }];
}

- (void)detect:(RCTResponseSenderBlock)callback {
    RCT_EXPORT();
    
    if ([FBSDKAccessToken currentAccessToken]) {
        FBSDKAccessToken *token = [FBSDKAccessToken currentAccessToken];
        NSString *tokenString = token.tokenString;
        NSString *userId = token.userID;
        NSDictionary *credentials = @{ @"token" : tokenString, @"userId" : userId };
        callback(@[[NSNull null], credentials]);
    } else {
        callback(@[@"NoExistingLoginFound", [NSNull null]]);
    }
}

@end
