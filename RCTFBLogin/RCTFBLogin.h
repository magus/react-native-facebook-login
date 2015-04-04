#import "RCTView.h"

@interface RCTFBLogin : RCTView

@property (nonatomic, assign) NSArray *permissions;

- (void)setDelegate:(id<FBSDKLoginButtonDelegate>)delegate;

@end
