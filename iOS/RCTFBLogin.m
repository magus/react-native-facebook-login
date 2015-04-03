#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

#import "RCTFBLogin.h"
#import "RCTLog.h"

@implementation RCTFBLogin
{
    FBSDKLoginButton *_loginButton;
}

- (id)init
{
  if ((self = [super init])) {
      _loginButton = [[FBSDKLoginButton alloc] init];
      _loginButton.readPermissions = @[@"email"];
      [self addSubview:_loginButton];
  }

  return self;
}

- (void)setPermissions:(NSArray *)permissions
{
    _loginButton.readPermissions = permissions;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    RCTAssert(self.subviews.count == 1, @"we should only have exactly one subview");
    RCTAssert([self.subviews lastObject] == _loginButton, @"our only subview should be a fbsdkloginbutton");
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

- (NSArray *)reactSubviews
{
    return @[];
}

@end
