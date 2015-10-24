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
#import "FBNativeAd.h"

@class FBNativeAdViewAttributes;

/*!
 @enum FBNativeAdViewType enum
 @abstract Determines the type of native ad template. Different views are created
 for different values of FBNativeAdViewType
 */
typedef NS_ENUM(NSInteger, FBNativeAdViewType) {
    FBNativeAdViewTypeGenericHeight100 = 1,
    FBNativeAdViewTypeGenericHeight120,
    FBNativeAdViewTypeGenericHeight300,
    FBNativeAdViewTypeGenericHeight400,
};

/*!
 @class FBNativeAdView

 @abstract
 The FBNativeAdView creates prebuilt native ad template views and manages native ads.
 */
FB_CLASS_EXPORT
@interface FBNativeAdView : UIView

/*!
 @property
 @abstract The type of the view, specifies which template to use
 */
@property (nonatomic, assign, readonly) FBNativeAdViewType type;

/*!
 @method
 @abstract
 This is a method to create a native ad template using the given placement id and type.
 @param nativeAd The native ad to use to create this view.
 @param type The type of this native ad template. For more information, consult FBNativeAdViewType.
 */
+ (nonnull instancetype)nativeAdViewWithNativeAd:(nonnull FBNativeAd *)nativeAd withType:(FBNativeAdViewType)type;

/*!
 @property
 @abstract A view controller that is used to present modal content. If nil, the view searches for a view controller.
 */
@property (nonatomic, weak, nullable) UIViewController *viewController;

/*!
 @method
 @abstract
 This is a method to create a native ad template using the given placement id and type.
 @param nativeAd The native ad to use to create this view.
 @param type The type of this native ad template. For more information, consult FBNativeAdViewType.
 @param attributes The attributes to render this native ad template with.
 */
+ (nonnull instancetype)nativeAdViewWithNativeAd:(nonnull FBNativeAd *)nativeAd withType:(FBNativeAdViewType)type withAttributes:(nonnull FBNativeAdViewAttributes *)attributes;

@end

/*!
 @class FBNativeAdViewLayout
 @abstract
 Describes the look and feel of a native ad view.
 */
@interface FBNativeAdViewAttributes : NSObject <NSCopying>

/*!
 ​​@method
 @abstract
 This is a method to create native ad view attributes with a dictionary
 */
- (nonnull instancetype)initWithDictionary:(nonnull NSDictionary *) dict;

/*!
 @property
 @abstract
 Background color of the native ad view.
 */
@property (nonatomic, copy, nullable) UIColor *backgroundColor;
/*!
 @property
 @abstract
 Color of the title label.
 */
@property (nonatomic, copy, nullable) UIColor *titleColor;
/*!
 @property
 @abstract
 Font of the title label.
 */
@property (nonatomic, copy, nullable) UIFont *titleFont;
/*!
 @property
 @abstract
 Color of the description label.
 */
@property (nonatomic, copy, nullable) UIColor *descriptionColor;
/*!
 @property
 @abstract
 Font of the description label.
 */
@property (nonatomic, copy, nullable) UIFont *descriptionFont;
/*!
 @property
 @abstract
 Background color of the call to action button.
 */
@property (nonatomic, copy, nullable) UIColor *buttonColor;
/*!
 @property
 @abstract
 Color of the call to action button's title label.
 */
@property (nonatomic, copy, nullable) UIColor *buttonTitleColor;
/*!
 @property
 @abstract
 Font of the call to action button's title label.
 */
@property (nonatomic, copy, nullable) UIFont *buttonTitleFont;
/*!
 @property
 @abstract
 Border color of the call to action button. If nil, no border is shown.
 */
@property (nonatomic, copy, nullable) UIColor *buttonBorderColor;
/*!
 @property
 @abstract
 Enables or disables autoplay for some types of media. Defaults to YES.
 */
@property (nonatomic, assign, getter=isAutoplayEnabled) BOOL autoplayEnabled;

/*!
 @method
 @abstract
 Returns default attributes for a given type.

 @param type The type for this layout.
 */
+ (nonnull instancetype)defaultAttributesForType:(FBNativeAdViewType)type;

@end
