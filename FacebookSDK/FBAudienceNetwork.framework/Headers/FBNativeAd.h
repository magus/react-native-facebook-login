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

@protocol FBNativeAdDelegate;
@class FBAdImage;

typedef NS_ENUM(NSInteger, FBNativeAdsCachePolicy) {
    FBNativeAdsCachePolicyNone = 0,
    FBNativeAdsCachePolicyIcon = 0x1,
    FBNativeAdsCachePolicyCoverImage = 0x2,
    FBNativeAdsCachePolicyAll = FBNativeAdsCachePolicyCoverImage | FBNativeAdsCachePolicyIcon,
};

/*!
 @class FBNativeAd

 @abstract
 The FBNativeAd represents ad metadata to allow you to construct custom ad views.
 See the NativeAdSample in the sample apps section of the Audience Network framework.
 */
FB_CLASS_EXPORT
@interface FBNativeAd : NSObject

/*!
 @property
 @abstract Typed access to the id of the ad placement.
 */
@property (nonatomic, copy, readonly, nonnull) NSString *placementID;
/*!
 @property
 @abstract Typed access to the ad star rating. See `FBAdStarRating` for details.
 */
@property (nonatomic, assign, readonly) struct FBAdStarRating starRating;
/*!
 @property
 @abstract Typed access to the ad title.
 */
@property (nonatomic, copy, readonly, nullable) NSString *title;
/*!
 @property
 @abstract Typed access to the ad subtitle.
 */
@property (nonatomic, copy, readonly, nullable) NSString *subtitle;
/*!
 @property
 @abstract Typed access to the ad social context, for example "Over half a million users".
 */
@property (nonatomic, copy, readonly, nullable) NSString *socialContext;
/*!
 @property
 @abstract Typed access to the call to action phrase of the ad, for example "Install Now".
 */
@property (nonatomic, copy, readonly, nullable) NSString *callToAction;
/*!
 @property
 @abstract Typed access to the ad icon. See `FBAdImage` for details.
 */
@property (nonatomic, strong, readonly, nullable) FBAdImage *icon;
/*!
 @property
 @abstract Typed access to the ad cover image creative. See `FBAdImage` for details.
 */
@property (nonatomic, strong, readonly, nullable) FBAdImage *coverImage;
/*!
 @property
 @abstract Typed access to the body text, usually a longer description of the ad.
 */
@property (nonatomic, copy, readonly, nullable) NSString *body;
/*!
 @property

 @abstract Set the native ad caching policy. This controls which media from the native ad are cached before the native ad calls nativeAdLoaded on its delegate. The default is to not block on caching.
 */
@property (nonatomic, assign) FBNativeAdsCachePolicy mediaCachePolicy;
/*!
 @property
 @abstract the delegate
 */
@property (nonatomic, weak, nullable) id<FBNativeAdDelegate> delegate;

/*!
 @method

 @abstract
 This is a method to initialize a FBNativeAd object matching the given placement id.

 @param placementID The id of the ad placement. You can create your placement id from Facebook developers page.
 */
- (nonnull instancetype)initWithPlacementID:(nonnull NSString *)placementID NS_DESIGNATED_INITIALIZER;

/*!
 @method

 @abstract
 This is a method to associate a FBNativeAd with the UIView you will use to display the native ads.

 @param view The UIView you created to render all the native ads data elements.
 @param viewController The UIViewController that will be used to present SKStoreProductViewController
 (iTunes Store product information) or the in-app browser.

 @discussion The whole area of the UIView will be clickable.
 */
- (void)registerViewForInteraction:(nonnull UIView *)view
                withViewController:(nonnull UIViewController *)viewController;

/*!
 @method

 @abstract
 This is a method to associate FBNativeAd with the UIView you will use to display the native ads
 and set clickable areas.

 @param view The UIView you created to render all the native ads data elements.
 @param viewController The UIViewController that will be used to present SKStoreProductViewController
 (iTunes Store product information).
 @param clickableViews An array of UIView you created to render the native ads data element, e.g.
 CallToAction button, Icon image, which you want to specify as clickable.
 */
- (void)registerViewForInteraction:(nonnull UIView *)view
                withViewController:(nonnull UIViewController *)viewController
                withClickableViews:(nonnull NSArray *)clickableViews;

/*!
 @method

 @abstract
 This is a method to disconnect a FBNativeAd with the UIView you used to display the native ads.
 */
- (void)unregisterView;

/*!
 @method

 @abstract
 Begins loading the FBNativeAd content.

 @discussion You can implement `nativeAdDidLoad:` and `nativeAd:didFailWithError:` methods
 of `FBNativeAdDelegate` if you would like to be notified as loading succeeds or fails.
 */
- (void)loadAd;

/*!
 @property

 @abstract
 Call isAdValid to check whether native ad is valid & internal consistent prior rendering using its properties. If
 rendering is done as part of the loadAd callback, it is guarantee to be consistent
 */
@property (nonatomic, getter=isAdValid, readonly) BOOL adValid;

@end

/*!
 @protocol

 @abstract
 The methods declared by the FBNativeAdDelegate protocol allow the adopting delegate to respond to messages
 from the FBNativeAd class and thus respond to operations such as whether the native ad has been loaded.
 */
@protocol FBNativeAdDelegate <NSObject>

@optional

/*!
 @method

 @abstract
 Sent when an FBNativeAd has been successfully loaded.

 @param nativeAd An FBNativeAd object sending the message.
 */
- (void)nativeAdDidLoad:(nonnull FBNativeAd *)nativeAd;

/*!
 @method

 @abstract
 Sent immediately before the impression of an FBNativeAd object will be logged.

 @param nativeAd An FBNativeAd object sending the message.
 */
- (void)nativeAdWillLogImpression:(nonnull FBNativeAd *)nativeAd;

/*!
 @method

 @abstract
 Sent when an FBNativeAd is failed to load.

 @param nativeAd An FBNativeAd object sending the message.
 @param error An error object containing details of the error.
 */
- (void)nativeAd:(nonnull FBNativeAd *)nativeAd didFailWithError:(nonnull NSError *)error;

/*!
 @method

 @abstract
 Sent after an ad has been clicked by the person.

 @param nativeAd An FBNativeAd object sending the message.
 */
- (void)nativeAdDidClick:(nonnull FBNativeAd *)nativeAd;

/*!
 @method

 @abstract
 When an ad is clicked, the modal view will be presented. And when the user finishes the
 interaction with the modal view and dismiss it, this message will be sent, returning control
 to the application.

 @param nativeAd An FBNativeAd object sending the message.
 */
- (void)nativeAdDidFinishHandlingClick:(nonnull FBNativeAd *)nativeAd;

@end

/*!
 @class FBAdStarRating

 @abstract
 Represents the Facebook ad star rating, which contains the rating value and rating scale.
 */
FB_EXPORT struct FBAdStarRating {
  CGFloat value;
  NSInteger scale;
} FBAdStarRating;

/*!
 @class FBAdImage

 @abstract Represents an image creative.
 */
FB_CLASS_EXPORT
@interface FBAdImage : NSObject

/*!
 @property
 @abstract Typed access to the image url.
 */
@property (nonatomic, copy, readonly, nonnull) NSURL *url;
/*!
 @property
 @abstract Typed access to the image width.
 */
@property (nonatomic, assign, readonly) NSInteger width;
/*!
 @property
 @abstract Typed access to the image height.
 */
@property (nonatomic, assign, readonly) NSInteger height;

/*!
 @method

 @abstract
 This is a method to initialize an FBAdImage.

 @param url the image url.
 @param width the image width.
 @param height the image height.
 */
- (nonnull instancetype)initWithURL:(nonnull NSURL *)url width:(NSInteger)width height:(NSInteger)height NS_DESIGNATED_INITIALIZER;

/*!
 @method

 @abstract
 Loads an image from self.url over the network, or returns the cached image immediately.

 @param block Block to handle the loaded image.
 */
- (void)loadImageAsyncWithBlock:(nullable void (^)(UIImage * __nullable image))block;

@end

/*!
 @class FBAdStarRatingView

 @abstract
 Helper view that draws a star rating based off a native ad.
 */
FB_CLASS_EXPORT
@interface FBAdStarRatingView : UIView

/*!
 @property
 @abstract The current rating from an FBNativeAd. When set, updates the view.
 */
@property (nonatomic) struct FBAdStarRating rating;

/*!
 @property
 @abstract The color drawn for filled-in stars. Defaults to yellow.
 */
@property (strong, nonatomic, nonnull) UIColor *primaryColor;

/*!
 @property
 @abstract The color drawn for empty stars. Defaults to gray.
 */
@property (strong, nonatomic, nonnull) UIColor *secondaryColor;

/*!
 @method

 @abstract
 Initializes a star rating view with a given frame and star rating.

 @param frame Frame of this view.
 @param starRating Star rating from a native ad.
 */
- (nonnull instancetype)initWithFrame:(CGRect)frame withStarRating:(struct FBAdStarRating)starRating NS_DESIGNATED_INITIALIZER;

@end
