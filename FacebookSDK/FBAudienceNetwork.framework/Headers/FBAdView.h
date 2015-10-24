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
#import "FBAdSize.h"

@protocol FBAdViewDelegate;

/*!
 @class FBAdView

 @abstract A customized UIView to represent a Facebook ad (a.k.a. banner ad).
 */
FB_CLASS_EXPORT
@interface FBAdView : UIView

/*!
 @method

 @abstract
 This is a method to initialize an FBAdView matching the given placement id.

 @param placementID The id of the ad placement. You can create your placement id from Facebook developers page.
 @param adSize The size of the ad; for example, kFBAdSizeHeight50Banner or kFBAdSizeHeight90Banner.
 @param viewController The view controller that will be used to present the ad and the app store view.
 */
- (nonnull instancetype)initWithPlacementID:(nonnull NSString *)placementID
                                     adSize:(FBAdSize)adSize
                         rootViewController:(nonnull UIViewController *)viewController NS_DESIGNATED_INITIALIZER;

/*!
 @method

 @abstract
 Begins loading the FBAdView content.

 @discussion You can implement `adViewDidLoad:` and `adView:didFailWithError:` methods
 of `FBAdViewDelegate` if you would like to be notified as loading succeeds or fails.
 */
- (void)loadAd;

/*!
 @method

 @abstract
 This is a method to disable auto refresh for the FBAdView instance

 @discussion By default, we read the refresh interval from the placement setting in your Facebook
 developers page. Once you call this method, the auto refresh will be disabled for this FBAdView
 instance, and you cannot re-enable the refresh for this instance. A new created FBAdView will still
 use the default behavior.

 This method is designed for ad network mediation. We still recommend you to set the placement
 refresh interval as 'None' if you're using one of the ad network mediation.
 */
- (void)disableAutoRefresh;

/*!
 @property
 @abstract Typed access to the id of the ad placement.
 */
@property (nonatomic, copy, readonly, nonnull) NSString *placementID;
/*!
 @property
 @abstract Typed access to the app's root view controller.
 */
@property (nonatomic, weak, readonly, nullable) UIViewController *rootViewController;
/*!
 @property
 @abstract the delegate
 */
@property (nonatomic, weak, nullable) id<FBAdViewDelegate> delegate;

@end

/*!
 @protocol

 @abstract
 The methods declared by the FBAdViewDelegate protocol allow the adopting delegate to respond
 to messages from the FBAdView class and thus respond to operations such as whether the ad has
 been loaded, the person has clicked the ad.
 */
@protocol FBAdViewDelegate <NSObject>

@optional

/*!
 @method

 @abstract
 Sent after an ad has been clicked by the person.

 @param adView An FBAdView object sending the message.
 */
- (void)adViewDidClick:(nonnull FBAdView *)adView;
/*!
 @method

 @abstract
 When an ad is clicked, the modal view will be presented. And when the user finishes the
 interaction with the modal view and dismiss it, this message will be sent, returning control
 to the application.

 @param adView An FBAdView object sending the message.
 */
- (void)adViewDidFinishHandlingClick:(nonnull FBAdView *)adView;
/*!
 @method

 @abstract
 Sent when an ad has been successfully loaded.

 @param adView An FBAdView object sending the message.
 */
- (void)adViewDidLoad:(nonnull FBAdView *)adView;
/*!
 @method

 @abstract
 Sent after an FBAdView fails to load the ad.

 @param adView An FBAdView object sending the message.
 @param error An error object containing details of the error.
 */
- (void)adView:(nonnull FBAdView *)adView didFailWithError:(nonnull NSError *)error;

/*!
 @method

 @abstract
 Sent immediately before the impression of an FBAdView object will be logged.

 @param adView An FBAdView object sending the message.
 */
- (void)adViewWillLogImpression:(nonnull FBAdView *)adView;

/*!
 @method

 @abstract
 Asks the delegate for a view controller to present modal content, such as the in-app
 browser that can appear when an ad is clicked.

 @return A view controller that is used to present modal content.
 */
- (nonnull UIViewController *)viewControllerForPresentingModalView;

@end
