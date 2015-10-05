#import "RCTView.h"

@interface RCTFBLogin : RCTView

@property (nonatomic, assign) NSArray *permissions;
@property (nonatomic, assign) NSNumber *loginBehavior;

- (void)setDelegate:(id<FBSDKLoginButtonDelegate>)delegate;

@end
