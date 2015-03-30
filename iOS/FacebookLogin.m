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
            // Process error
        } else if (result.isCancelled) {
            // Handle cancellations
        } else {
            // If you ask for multiple permissions at once, you
            // should check if specific permissions missing
            if ([result.grantedPermissions containsObject:@"email"]) {
                // Do work
            }
        }
    }];
}

@end