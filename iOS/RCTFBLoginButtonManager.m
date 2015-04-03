#import "RCTFBLoginButtonManager.h"
#import "RCTFBLoginButton.h"
#import "RCTBridge.h"

@implementation RCTFBLoginButtonManager

@synthesize bridge = _bridge;

- (UIView *)view
{
  return [[RCTFBLoginButton alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(permissions, NSStringArray);

@end
