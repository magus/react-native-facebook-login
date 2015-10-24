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

@class FBAdImage;
@class FBNativeAd;
@class FBNativeAdViewAttributes;

/*!
 @class FBAdChoicesView

 @abstract
 FBAdChoicesView offers a simple way to display a sponsored or AdChoices icon.
 */
FB_CLASS_EXPORT
@interface FBAdChoicesView : UIView

/*!
 @property
 @abstract Access to the text label contained in this view.
 */
@property (nonatomic, weak, readonly, nullable) UILabel *label;

/*!
 @property
 @abstract Determines whether the background mask is shown, or a transparent mask is used.
 */
@property (nonatomic, assign, getter=isBackgroundShown) BOOL backgroundShown;

/*!
 @property
 @abstract Determines whether the view can be expanded upon being tapped, or defaults to fullsize. Defaults to NO.
 */
@property (nonatomic, assign, readonly, getter=isExpandable) BOOL expandable;

/*!
 @method

 @abstract
 Initialize this view with a given native ad. Configuration is pulled from the native ad.

 @param nativeAd The native ad to initialize with.
 */
- (nonnull instancetype)initWithNativeAd:(nonnull FBNativeAd *)nativeAd;

/*!
 @method

 @abstract
 Initialize this view with a given native ad. Configuration is pulled from the native ad.

 @param nativeAd The native ad to initialize with.
 @param expandable Controls whether view defaults to expanded or not, see property documentation
 */
- (nonnull instancetype)initWithNativeAd:(nonnull FBNativeAd *)nativeAd
                              expandable:(BOOL)expandable;

/*!
 @method

 @abstract
 Initialize this view with explicit parameters.

 @param viewController View controller to present the AdChoices webview from.
 @param adChoicesIcon Native ad AdChoices icon.
 @param adChoicesLinkURL Native ad AdChoices link URL.
 @param attributes Attributes to configure look and feel.
 */
- (nonnull instancetype)initWithViewController:(nonnull UIViewController *)viewController
                                 adChoicesIcon:(nonnull FBAdImage *)adChoicesIcon
                              adChoicesLinkURL:(nonnull NSURL *)adChoicesLinkURL
                                    attributes:(nullable FBNativeAdViewAttributes *)attributes;
/*!
 @method

 @abstract
 Initialize this view with explicit parameters.

 @param viewController View controller to present the AdChoices webview from.
 @param adChoicesIcon Native ad AdChoices icon.
 @param adChoicesLinkURL Native ad AdChoices link URL.
 @param attributes Attributes to configure look and feel.
 @param expandable Controls whether view defaults to expanded or not, see property documentation
 */
- (nonnull instancetype)initWithViewController:(nonnull UIViewController *)viewController
                                 adChoicesIcon:(nonnull FBAdImage *)adChoicesIcon
                              adChoicesLinkURL:(nonnull NSURL *)adChoicesLinkURL
                                    attributes:(nullable FBNativeAdViewAttributes *)attributes
                                    expandable:(BOOL)expandable NS_DESIGNATED_INITIALIZER;
/*!
 @method

 @abstract
 Using the superview, this updates the frame of this view, positioning the icon in the top right corner by default.
 */
- (void)updateFrameFromSuperview;

/*!
 @method

 @abstract
 Using the superview, this updates the frame of this view, positioning the icon in the corner specified. UIRectCornerAllCorners not supported.

 @param corner The corner to display this view from.
 */
- (void)updateFrameFromSuperview:(UIRectCorner)corner;

@end
