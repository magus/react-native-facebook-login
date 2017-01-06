#import <React/RCTView.h>

@interface RCTMFBLogin : RCTView

@property (nonatomic, assign) NSArray *permissions;
@property (nonatomic, assign) NSNumber *loginBehavior;

- (void)setDelegate:(id<FBSDKLoginButtonDelegate>)delegate;

@end
