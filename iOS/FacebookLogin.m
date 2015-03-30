//
//  FacebookLogin.m
//  toy
//
//  Created by Noah Jorgenson on 3/30/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "FacebookLogin.h"

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

@implementation FacebookLogin

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
    callback(@[@"Error::NoExistingLoginFound", [NSNull null]]);
  }
}

@end
