// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
//
// You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
// copy, modify, and distribute this software in source code or binary form for use
// in connection with the web services and APIs provided by Facebook.
//
// As with any software that integrates with the Facebook platform, your use of
// this software is subject to the Facebook Developer Principles and Policies
// [http://developers.facebook.com/policy/]. This copyright notice shall be
// included in all copies or substantial portions of the software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

#import <Foundation/Foundation.h>

#import "FBAdDefines.h"

FB_EXPORT NSString * const __nonnull FBAudienceNetworkErrorDomain;

typedef NS_ENUM(NSInteger, FBAdLogLevel) {
    FBAdLogLevelNone,
    FBAdLogLevelNotification,
    FBAdLogLevelError,
    FBAdLogLevelWarning,
    FBAdLogLevelLog,
    FBAdLogLevelDebug,
    FBAdLogLevelVerbose
};

/*!
 @class FBAdSettings

 @abstract AdSettings contains global settings for all ad controls.
 */
FB_CLASS_EXPORT
@interface FBAdSettings : NSObject

/*!
 @method

 @abstract
 Adds a test device.

 @param deviceHash The id of the device to use test mode, can be obtained from debug log

 @discussion
 Copy the current device Id from debug log and add it as a test device to get test ads. Apps
 running on emulator will automatically get test ads. Test devices should be added before loadAd is called.
 */
+ (void)addTestDevice:(nonnull NSString *)deviceHash;

/*!
 @method

 @abstract
 Add a collection of test devices. See `+addTestDevices:` for details.

 @param devicesHash The array of the device id to use test mode, can be obtained from debug log
 */
+ (void)addTestDevices:(nonnull NSArray *)devicesHash;

/*!
 @method

 @abstract
 Clear all the added test devices
 */
+ (void)clearTestDevices;

/*!
 @method

 @abstract
 Configures the ad control for treatment as child-directed.

 @param isChildDirected Indicates whether you would like your ad control to be treated as child-directed

 @discussion
 Note that you may have other legal obligations under the Children's Online Privacy Protection Act (COPPA).
 Please review the FTC's guidance and consult with your own legal counsel.
 */
+ (void)setIsChildDirected:(BOOL)isChildDirected;

/*!
 @method

 @abstract
 Sets the url prefix to use when making ad requests.

 @discussion
 This method should never be used in production.
 */
+ (void)setUrlPrefix:(nonnull NSString *) urlPrefix;

/*!
 @method

 @abstract
 Gets the current SDK logging level
 */
+ (FBAdLogLevel)getLogLevel;

/*!
 @method

 @abstract
 Sets the current SDK logging level
 */
+ (void)setLogLevel:(FBAdLogLevel)level;

@end
