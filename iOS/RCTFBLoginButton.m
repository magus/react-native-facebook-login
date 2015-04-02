#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

#import "RCTFBLoginButton.h"
#import "RCTLog.h"

#import "RCTEventDispatcher.h"
#import "UIView+React.h"

@implementation RCTFBLoginButton
{
  FBSDKLoginButton *_loginButton;
}

- (id)init
{
  if ((self = [super init])) {
      _loginButton = [[FBSDKLoginButton alloc] init];
      _loginButton.center = self.center;
      _loginButton.readPermissions = @[@"public_profile", @"email", @"user_friends"];
      [self addSubview:_loginButton];
  }

  return self;
}

- (NSArray *)reactSubviews
{
    NSArray *subviews = @[_loginButton];
    return subviews;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _loginButton.frame = _loginButton.bounds;
}

- (void)insertReactSubview:(UIView *)view atIndex:(NSInteger)atIndex
{
    RCTLogError(@"FBLoginButton does not support subviews");
    return;
}

- (void)removeReactSubview:(UIView *)subview
{
    RCTLogError(@"FBLoginButton does not support subviews");
    return;
}

@end
