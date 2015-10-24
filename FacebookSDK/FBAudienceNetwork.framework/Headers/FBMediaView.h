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

#import <UIKit/UIKit.h>

#import "FBAdDefines.h"

@protocol FBMediaViewDelegate;
@class FBNativeAd;

/*!
 @class FBNativeAd

 @abstract
 The FBMediaView loads media content from a given FBNativeAd. This view takes the place of manually loading a cover image.
 */
FB_CLASS_EXPORT
@interface FBMediaView : UIView

/*!
 @property
 @abstract the delegate
 */
@property (nonatomic, weak, nullable) id<FBMediaViewDelegate> delegate;

/*!
 @method
 @abstract
 This is a method to create a media view using the given native ad.
 @param nativeAd The native ad to load media content from.
 */
- (nonnull instancetype)initWithNativeAd:(nonnull FBNativeAd *)nativeAd;

/*!
 @property
 @abstract the native ad, can be set again to reuse this view.
 */
@property (nonatomic, strong, nonnull) FBNativeAd *nativeAd;

/*!
 @property
 @abstract Enables or disables autoplay for some types of media. Defaults to YES.
 */
@property (nonatomic, assign, getter=isAutoplayEnabled) BOOL autoplayEnabled;

@end

/*!
 @protocol

 @abstract
 The methods declared by the FBMediaViewDelegate protocol allow the adopting delegate to respond to messages from the FBMediaView class and thus respond to operations such as whether the media content has been loaded.
 */
@protocol FBMediaViewDelegate <NSObject>

@optional

/*!
 @method

 @abstract
 Sent when an FBMediaView has been successfully loaded.

 @param mediaView An FBMediaView object sending the message.
 */
- (void)mediaViewDidLoad:(nonnull FBMediaView *)mediaView;

@end
