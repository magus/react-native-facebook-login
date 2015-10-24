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

#import <StoreKit/StoreKit.h>
#import <UIKit/UIKit.h>

#import "FBAdDefines.h"

/*!
 @typedef FBAdSize

 @abstract
 Represents the ad size.
 */
typedef struct FBAdSize {
  CGSize size;
} FBAdSize;

/*!
 @abstract DEPRECATED - Represents the fixed banner ad size - 320pt by 50pt.
 */
FB_EXPORT FBAdSize const kFBAdSize320x50;

/*!
 @abstract Represents the flexible banner ad size, where banner width depends on
 its container width, and banner height is fixed as 50pt.
 */
FB_EXPORT FBAdSize const kFBAdSizeHeight50Banner;

/*!
 @abstract Represents the flexible banner ad size, where banner width depends on
 its container width, and banner height is fixed as 90pt.
 */
FB_EXPORT FBAdSize const kFBAdSizeHeight90Banner;

/*!
 @abstract Represents the interstitial ad size.
 */
FB_EXPORT FBAdSize const kFBAdSizeInterstital;

/*!
 @abstract Represents the flexible rectangle ad size, where width depends on
 its container width, and height is fixed as 250pt.
 */
FB_EXPORT FBAdSize const kFBAdSizeHeight250Rectangle;

FB_CLASS_EXPORT
@interface FBAdCustomSize : NSObject

+ (FBAdSize)customSize:(CGSize)size;

@end
